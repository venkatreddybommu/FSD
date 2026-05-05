package com.techfest.ticketbooking.service;

import com.techfest.ticketbooking.entity.Booking;
import com.techfest.ticketbooking.entity.Event;
import com.techfest.ticketbooking.repository.BookingRepository;
import com.techfest.ticketbooking.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    // Books tickets for a given event after validating all inputs.
    // @Transactional ensures the event ticket deduction + booking save happen atomically.
    @Transactional
    public Map<String, Object> bookTickets(Booking booking) {
        Map<String, Object> response = new HashMap<>();

        // Validate: name must not be empty
        if (booking.getName() == null || booking.getName().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Name is required.");
            return response;
        }

        // Validate: email must not be empty and must be valid format
        if (booking.getEmail() == null || booking.getEmail().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Email is required.");
            return response;
        }
        if (!booking.getEmail().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            response.put("success", false);
            response.put("message", "Please enter a valid email address.");
            return response;
        }

        // Validate: number of tickets must be positive
        if (booking.getNumberOfTickets() <= 0) {
            response.put("success", false);
            response.put("message", "Number of tickets must be at least 1.");
            return response;
        }

        // Look up the event being booked
        if (booking.getEventId() == null) {
            response.put("success", false);
            response.put("message", "Event ID is required.");
            return response;
        }

        Optional<Event> eventOpt = eventRepository.findById(booking.getEventId());
        if (eventOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Event not found.");
            return response;
        }

        Event event = eventOpt.get();

        // Validate: cannot book more than available tickets for this event
        if (booking.getNumberOfTickets() > event.getAvailableTickets()) {
            response.put("success", false);
            response.put("message", "Only " + event.getAvailableTickets() + " tickets are available for this event.");
            return response;
        }

        // Deduct tickets from the event's available count and save event
        event.setAvailableTickets(event.getAvailableTickets() - booking.getNumberOfTickets());
        eventRepository.save(event);

        // Save booking to H2 database
        bookingRepository.save(booking);

        // Calculate total amount
        int totalAmount = booking.getNumberOfTickets() * event.getTicketPrice();

        // Build success response
        response.put("success", true);
        response.put("message", "Booking confirmed!");
        response.put("name", booking.getName());
        response.put("eventName", event.getName());
        response.put("ticketsBooked", booking.getNumberOfTickets());
        response.put("totalAmount", totalAmount);
        response.put("remainingTickets", event.getAvailableTickets());
        response.put("eventId", event.getId());

        return response;
    }
}
