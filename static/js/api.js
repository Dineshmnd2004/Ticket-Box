"use strict";

/* ============ Session (JWT stored in localStorage) ============ */
const Auth = {
  token() { return localStorage.getItem("tb_token"); },
  name() { return localStorage.getItem("tb_name") || ""; },
  set(token, name) {
    localStorage.setItem("tb_token", token);
    localStorage.setItem("tb_name", name || "");
  },
  clear() {
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_name");
  },
  isLoggedIn() { return Boolean(Auth.token()); }
};

/* ============ API client ============
   All pages live under /static, so absolute paths like /movies
   hit the Flask API on the same origin (no CORS needed). */
async function api(path, options) {
  options = options || {};
  const method = options.method || "GET";
  const headers = { "Content-Type": "application/json" };
  const token = Auth.token();
  if (token) headers["Authorization"] = "Bearer " + token;

  let res;
  try {
    res = await fetch(path, {
      method: method,
      headers: headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : null
    });
  } catch (err) {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  let data = null;
  try { data = await res.json(); } catch (err) { /* no JSON body */ }

  if (!res.ok) {
    if (res.status === 401 && token) Auth.clear();
    const error = new Error((data && data.error) || "Request failed (" + res.status + ")");
    error.status = res.status;
    throw error;
  }
  return data;
}

const apiGet = (path) => api(path);
const apiPost = (path, body) => api(path, { method: "POST", body: body });
const apiPut = (path, body) => api(path, { method: "PUT", body: body });
const apiDelete = (path) => api(path, { method: "DELETE" });

/* ============ Helpers ============ */
function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* Escape untrusted text before inserting it as HTML */
function h(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtDateTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

/* Single place to change the currency shown across the app.
   e.g. return "₹" + n.toFixed(2); */
function money(value) {
  const n = parseFloat(value);
  return isNaN(n) ? String(value) : n.toFixed(2);
}

function showAlert(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = "alert show " + (type || "error");
}

function hideAlert(el) {
  if (!el) return;
  el.className = "alert";
}

/* ============ Top navigation ============ */
function renderNav(active) {
  const host = document.getElementById("nav");
  if (!host) return;
  host.className = "topbar";

  const links = [
    { id: "movies", href: "index.html", label: "Movies" },
    { id: "bookings", href: "bookings.html", label: "My Bookings" },
    { id: "admin", href: "admin.html", label: "Admin" }
  ];

  host.innerHTML =
    '<a class="brand" href="index.html">🎟 TicketBox</a>' +
    "<nav>" +
    links.map(function (l) {
      return '<a href="' + l.href + '"' + (active === l.id ? ' class="active"' : "") + ">" + l.label + "</a>";
    }).join("") +
    "</nav>" +
    '<div class="spacer"></div>' +
    '<div class="auth">' +
    (Auth.isLoggedIn()
      ? '<span class="who">Hi, ' + h(Auth.name()) + "</span>" +
        '<button class="btn btn-ghost btn-sm" id="logout-btn">Logout</button>'
      : '<a class="btn btn-ghost btn-sm" href="login.html">Login</a>' +
        '<a class="btn btn-sm" href="register.html">Sign up</a>') +
    "</div>";

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      Auth.clear();
      window.location.href = "index.html";
    });
  }
}

/* Redirect to login when a page needs a session.
   Returns false (and navigates) when not logged in. */
function requireLogin() {
  if (Auth.isLoggedIn()) return true;
  const next = window.location.pathname + window.location.search;
  window.location.replace("login.html?next=" + encodeURIComponent(next));
  return false;
}
