package com.techfest.ticketbooking.controller;

import com.techfest.ticketbooking.entity.Booking;
import com.techfest.ticketbooking.entity.Event;
import com.techfest.ticketbooking.repository.BookingRepository;
import com.techfest.ticketbooking.repository.EventRepository;
import com.techfest.ticketbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

// @CrossOrigin allows React (running on port 3000) to call this backend (port 8081)
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    // POST /book — Accepts booking details (linked to an event) and processes the booking
    @PostMapping("/book")
    public ResponseEntity<Map<String, Object>> bookTickets(@RequestBody Booking booking) {
        Map<String, Object> result = bookingService.bookTickets(booking);

        // If booking failed (validation error), return 400 Bad Request
        if (!(Boolean) result.get("success")) {
            return ResponseEntity.badRequest().body(result);
        }

        // Booking succeeded — return 200 OK
        return ResponseEntity.ok(result);
    }

    // GET /bookings/user/{userId} — Returns all bookings made by the given user, enriched with event info
    @GetMapping("/bookings/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Booking b : bookings) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("bookingId",       b.getId());
            entry.put("name",            b.getName());
            entry.put("email",           b.getEmail());
            entry.put("department",      b.getDepartment());
            entry.put("numberOfTickets", b.getNumberOfTickets());
            entry.put("eventId",         b.getEventId());

            // Enrich with event details if available
            Optional<Event> evtOpt = eventRepository.findById(b.getEventId());
            if (evtOpt.isPresent()) {
                Event evt = evtOpt.get();
                entry.put("eventName",    evt.getName());
                entry.put("eventDate",    evt.getEventDate());
                entry.put("eventTime",    evt.getEventTime());
                entry.put("venue",        evt.getVenue());
                entry.put("ticketPrice",  evt.getTicketPrice());
                entry.put("totalAmount",  b.getNumberOfTickets() * evt.getTicketPrice());
            }
            result.add(entry);
        }
        return ResponseEntity.ok(result);
    }

    // GET /bookings — Admin: returns all bookings (with event info) across all users
    @GetMapping("/bookings")
    public ResponseEntity<List<Map<String, Object>>> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Booking b : bookings) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("bookingId",       b.getId());
            entry.put("userId",          b.getUserId());
            entry.put("name",            b.getName());
            entry.put("email",           b.getEmail());
            entry.put("department",      b.getDepartment());
            entry.put("numberOfTickets", b.getNumberOfTickets());
            entry.put("eventId",         b.getEventId());

            Optional<Event> evtOpt = eventRepository.findById(b.getEventId());
            if (evtOpt.isPresent()) {
                Event evt = evtOpt.get();
                entry.put("eventName",   evt.getName());
                entry.put("totalAmount", b.getNumberOfTickets() * evt.getTicketPrice());
            }
            result.add(entry);
        }
        return ResponseEntity.ok(result);
    }
}
