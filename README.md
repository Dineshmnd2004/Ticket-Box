# Ticket Box

Ticket Box is a movie ticket booking website built with Python and Flask. It allows users to register, log in, view movies, book seats, and manage their bookings. Admin users can add and manage movies, theatres, screens, shows, and seat layouts.

## Features

- User registration and login
- JWT-based authentication
- Admin-only management features
- View available movies and shows
- Book multiple seats for a show
- Check seat availability
- View personal booking history
- Cancel bookings before the show starts

## Tech Stack

- Python
- Flask
- Flask-SQLAlchemy
- MySQL
- JWT (JSON Web Tokens)
- HTML, CSS, JavaScript

## Project Structure

- `app.py` - Main application and API routes
- `static/` - Frontend static files
- `requirements.txt` - Python dependencies
- `.env.example` - Sample environment file
- `e.r diagram.png` - ER diagram for the project

## Requirements

- Python 3.x
- MySQL database
- Virtual environment (recommended)

## Setup

1. Clone the repository
2. Open the terminal in the project folder
3. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

## Database Configuration

This project uses MySQL with the database name:

```text
ticket_booking
```

The app is configured in `app.py` as:

```python
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://root:@localhost:3306/ticket_booking"
)
```

If your MySQL username/password is different, update this connection string accordingly.

## Environment Variables

Create a `.env` file from the sample:

```bash
cp .env.example .env
```

Then add your secret key:

```env
SECRET_KEY=your_secret_key_here
```

## Run the Application

Start the app with:

```bash
python app.py
```

The server will run locally at:

```text
http://127.0.0.1:5000
```

## Main API Endpoints

### User

- `POST /users` - Register a user
- `POST /login` - Login and get JWT token
- `GET /me` - Get logged-in user details

### Movies

- `GET /movies` - Get all movies
- `POST /movies` - Add a movie (Admin)
- `PUT /movies/<id>` - Update a movie (Admin)
- `DELETE /movies/<id>` - Delete a movie (Admin)

### Theatres and Screens

- `GET /theatres`
- `POST /theatres` - Add a theatre (Admin)
- `GET /screens`
- `POST /screens` - Add a screen (Admin)

### Shows

- `GET /shows` - Get all scheduled shows
- `POST /shows` - Add a show (Admin)

### Bookings

- `POST /bookings` - Book tickets
- `GET /bookings/my` - View my bookings
- `DELETE /bookings/<id>` - Cancel a booking

### Seats

- `POST /screens/<id>/seats` - Add seats to a screen
- `GET /shows/<id>/seats` - View seat status for a show

## Notes

- The app automatically creates database tables when started using:

```python
db.create_all()
```

- Admin access is protected with login and admin-check logic.

## License

This project is for learning and personal use.
