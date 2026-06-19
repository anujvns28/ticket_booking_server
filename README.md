# ticket-booking  Backend

## Overview

ticket-booking, this is a backend system for an event seat booking application.

This project handles user authentication, event creation, event listing, seat reservation, booking confirmation, and prevents double booking of seats when multiple users try to book at the same time.

The main focus of this project is managing seat availability and reservation expiry efficiently.

---

## Features

- User Registration
- User Login using JWT Authentication
- Create New Events
- Fetch All Events
- Fetch Single Event with Seat Details
- Reserve Seats for 10 Minutes
- Confirm Booking
- Automatic Reservation Expiry
- Prevent Double Booking
- Seat Status Management

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

---

## Folder Structure

```bash
backend/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
├── utils/
├── .env
├── server.js
└── package.json
```

---

## Database Models

### User Model

Stores registered user data.

Fields:
- name
- email
- password

---

### Event Model

Stores event details.

Fields:
- name
- venue
- date
- totalSeats

---

### Seat Model

Stores individual seat information.

Fields:
- eventId
- seatNumber
- status

Possible status values:

- available
- reserved
- booked

---

### Reservation Model

Stores temporary seat reservations.

Fields:
- userId
- eventId
- seatNumbers
- expiresAt

---

## API Endpoints

---

### Authentication Routes

#### Register User

```http
POST /auth/register
```

Request Body:

```json
{
  "name": "Anuj",
  "email": "anuj@gmail.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

#### Login User

```http
POST /auth/login
```

Request Body:

```json
{
  "email": "anuj@gmail.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token"
}
```

---

## Event Routes

### Create Event

```http
POST /events
```

Request Body:

```json
{
  "name": "Coldplay Concert",
  "venue": "Mumbai",
  "date": "2026-06-25",
  "totalSeats": 50
}
```

Response:

```json
{
  "success": true,
  "message": "Event created successfully"
}
```

---

### Get All Events

```http
GET /events
```

Response returns all events.

---

### Get Single Event

```http
GET /events/:id
```

Response returns:
- Event details
- All seats of the event

---

## Reservation Routes

### Reserve Seats

```http
POST /reserve
```

Request Body:

```json
{
  "eventId": "event_id",
  "seatNumbers": ["A1", "A2", "A3"]
}
```

Response:

```json
{
  "success": true,
  "message": "Seats reserved successfully"
}
```

Behavior:
- Checks whether seats are available
- Creates reservation entry
- Marks seats as reserved
- Reservation valid for 10 minutes

---

## Booking Routes

### Confirm Booking

```http
POST /bookings
```

Request Body:

```json
{
  "reservationId": "reservation_id"
}
```

Response:

```json
{
  "success": true,
  "message": "Booking confirmed successfully"
}
```

Behavior:
- Converts reserved seats to booked
- Removes reservation

---

## Seat Reservation Flow

1. User selects seats  
2. Backend checks seat availability  
3. Reservation is created  
4. Seats become reserved  
5. Reservation remains active for 10 minutes  
6. User confirms booking  
7. Seats become booked  

If reservation expires before booking, seats become available again.

---

## Challenges Faced

Some challenges while building this project:

- Preventing double booking when multiple users reserve same seats
- Handling reservation expiry correctly
- Keeping seat status synchronized during reserve and booking operations
- Managing reservation timer logic

---

## Environment Variables

Create a `.env` file in root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Installation

Clone repository:

```bash
git clone <repository_url>
```

Install dependencies:

```bash
npm install
```

Run server:

```bash
npm run dev
```

---

## Future Improvements

- WebSocket based real-time seat updates
- Payment gateway integration
- Admin dashboard for event management
- Booking history for users

---

## Author

Anuj Yadav  
MERN Stack Developer