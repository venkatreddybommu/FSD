# Tech Fest 2026 - Ticket Booking System

A full-stack ticket booking web application built with **React JS** (frontend) and **Spring Boot + H2** (backend), featuring user authentication, dynamic events, and a mock payment gateway.

---

## Project Structure

```
Project1/
├── backend/                                ← Spring Boot project
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/techfest/ticketbooking/
│       │   ├── TicketBookingApplication.java   ← Main class
│       │   ├── DataInitializer.java            ← Seeds default admin + events
│       │   ├── controller/
│       │   │   ├── AuthController.java         ← /login, /register
│       │   │   ├── EventController.java        ← /events (GET, POST)
│       │   │   └── BookingController.java      ← /book (POST)
│       │   ├── service/
│       │   │   └── BookingService.java         ← Business logic
│       │   ├── repository/
│       │   │   ├── UserRepository.java         ← DB access for users
│       │   │   ├── EventRepository.java        ← DB access for events
│       │   │   └── BookingRepository.java      ← DB access for bookings
│       │   └── entity/
│       │       ├── User.java                   ← JPA entity (users table)
│       │       ├── Event.java                  ← JPA entity (events table)
│       │       └── Booking.java                ← JPA entity (bookings table)
│       └── resources/
│           └── application.properties          ← H2 config, port 8081
│
└── frontend/                               ← React project
    ├── package.json
    └── src/
        ├── index.js                ← React entry point
        ├── index.css               ← Full dark-theme design system
        ├── App.js                  ← Router + auth guards
        ├── LoginPage.js            ← /login route
        ├── RegisterPage.js         ← /register route
        ├── EventList.js            ← /events — browse all events
        ├── BookingPage.js          ← /book/:eventId — booking form
        ├── PaymentForm.js          ← Mock payment screen (step 2)
        ├── AdminDashboard.js       ← /admin — create new events
        └── EventDetails.js         ← (legacy, kept for reference)
```

---

## How to Run

### Step 1 — Run the Backend (Spring Boot)

**Requirements:** Java 17+, VS Code with Spring Boot Dashboard extension (or IntelliJ IDEA)

Open the `backend/` folder in VS Code and click **Run** in the Spring Boot Dashboard, OR use:

```bash
# If you have Maven installed:
cd backend
mvn spring-boot:run
```

The server starts at: **http://localhost:8081**

> **Auto-seeded on startup:**
> - Admin user: `username=admin`, `password=admin123`
> - Two sample events: *Tech Fest 2026* and *Cultural Night 2026*

- H2 Console: `http://localhost:8081/h2-console`
  - JDBC URL: `jdbc:h2:mem:ticketdb`
  - Username: `sa`
  - Password: *(leave blank)*

---

### Step 2 — Run the Frontend (React)

**Requirements:** Node.js 16+

```bash
cd frontend
npm install
npm start
```

The React app opens at: **http://localhost:3000**

---

## User Flow

1. **Register** a new account at `/register` (role: USER)  
   OR use the pre-seeded **Admin** account: `admin` / `admin123`
2. **Login** at `/login` — redirects to `/events` (user) or `/admin` (admin)
3. **Browse Events** at `/events` — see all events with availability
4. **Book a Ticket** — click "Book Now", fill details, proceed to payment
5. **Mock Payment** — enter any 16-digit card number (no real money charged)
6. **Confirmation** screen shows your booking summary

**Admin can:**
- Go to `/admin` to create new events dynamically

---

## Features

| Feature | Details |
|---|---|
| User Registration & Login | Simple localStorage-based auth, no Spring Security |
| Role-based Routing | ADMIN → /admin, USER → /events |
| Dynamic Events | Stored in DB, fetch from backend |
| Event Listing Page | Cards with availability progress bar |
| Booking Form | Per-event, linked to userId + eventId |
| Mock Payment Gateway | Credit card form (no real money) |
| Admin Dashboard | Create new events via form |
| H2 Database | All data (users, events, bookings) stored in memory |
| Dark Theme UI | Modern glassmorphism design with animations |

---

## APIs

### POST /register
```json
// Request
{ "username": "student1", "password": "pass123" }

// Success
{ "success": true, "message": "Registration successful!" }
```

### POST /login
```json
// Request
{ "username": "admin", "password": "admin123" }

// Success
{ "success": true, "userId": 1, "username": "admin", "role": "ADMIN" }
```

### GET /events
Returns an array of all events (id, name, department, eventDate, eventTime, venue, ticketPrice, totalTickets, availableTickets).

### POST /events *(Admin)*
```json
// Request
{
  "name": "Hackathon 2026",
  "department": "Computer Science",
  "eventDate": "2026-06-01",
  "eventTime": "09:00",
  "venue": "Lab Block 3",
  "ticketPrice": 0,
  "totalTickets": 30
}
```

### POST /book
```json
// Request
{
  "userId": 2,
  "eventId": 1,
  "name": "Ravi Kumar",
  "email": "ravi@college.com",
  "department": "CSE",
  "numberOfTickets": 2
}

// Success
{
  "success": true,
  "message": "Booking confirmed!",
  "name": "Ravi Kumar",
  "eventName": "Tech Fest 2026",
  "ticketsBooked": 2,
  "totalAmount": 200,
  "remainingTickets": 48
}
```
