package com.techfest.ticketbooking.controller;

import com.techfest.ticketbooking.entity.Event;
import com.techfest.ticketbooking.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Handles fetching and creating events
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // GET /events — Returns all events for the event listing page
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events);
    }

    // GET /events/{id} — Returns a single event by its ID
    @GetMapping("/events/{id}")
    public ResponseEntity<Map<String, Object>> getEventById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        return eventRepository.findById(id)
                .map(event -> ResponseEntity.ok(Map.<String, Object>of("success", true, "event", event)))
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "Event not found.")));
    }

    // POST /events — Admin-only: creates a new event
    @PostMapping("/events")
    public ResponseEntity<Map<String, Object>> createEvent(@RequestBody Event event) {
        Map<String, Object> response = new HashMap<>();

        // Basic validation
        if (event.getName() == null || event.getName().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Event name is required.");
            return ResponseEntity.badRequest().body(response);
        }
        if (event.getTotalTickets() <= 0) {
            response.put("success", false);
            response.put("message", "Total tickets must be at least 1.");
            return ResponseEntity.badRequest().body(response);
        }
        if (event.getTicketPrice() < 0) {
            response.put("success", false);
            response.put("message", "Ticket price cannot be negative.");
            return ResponseEntity.badRequest().body(response);
        }

        // Set available tickets = total tickets when creating
        event.setAvailableTickets(event.getTotalTickets());

        Event savedEvent = eventRepository.save(event);

        response.put("success", true);
        response.put("message", "Event created successfully!");
        response.put("eventId", savedEvent.getId());
        return ResponseEntity.ok(response);
    }

    // DELETE /events/{id} — Admin-only: deletes an event by ID
    @DeleteMapping("/events/{id}")
    public ResponseEntity<Map<String, Object>> deleteEvent(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        if (!eventRepository.existsById(id)) {
            response.put("success", false);
            response.put("message", "Event not found.");
            return ResponseEntity.badRequest().body(response);
        }
        eventRepository.deleteById(id);
        response.put("success", true);
        response.put("message", "Event deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
