package com.techfest.ticketbooking;

import com.techfest.ticketbooking.entity.Event;
import com.techfest.ticketbooking.entity.User;
import com.techfest.ticketbooking.repository.EventRepository;
import com.techfest.ticketbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// This class runs when the Spring Boot app starts
// It seeds the H2 database with a default admin user and one sample event
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public void run(String... args) throws Exception {

        // Create default ADMIN user (only if it doesn't already exist)
        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(new User("admin", "admin123", "ADMIN"));
            System.out.println("✅ Default ADMIN created: username=admin, password=admin123");
        }

        // Seed initial events (only if no events exist yet)
        if (eventRepository.count() == 0) {
            eventRepository.save(new Event(
                    "Tech Fest 2026",
                    "Computer Science",
                    "2026-05-10",
                    "10:00",
                    "College Auditorium",
                    100,
                    50
            ));
            eventRepository.save(new Event(
                    "Cultural Night 2026",
                    "Arts & Humanities",
                    "2026-05-12",
                    "18:00",
                    "Open Air Theatre",
                    50,
                    100
            ));
            System.out.println("✅ Seeded 2 default events into the database.");
        }
    }
}
