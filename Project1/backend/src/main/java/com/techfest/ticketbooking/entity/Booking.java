package com.techfest.ticketbooking.entity;

import jakarta.persistence.*;

// This class maps to the "bookings" table in H2 database
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which user made this booking (stored as userId from localStorage)
    private Long userId;

    // Which event is being booked (foreign key link to events table)
    private Long eventId;

    private String name;
    private String email;
    private String department;
    private int numberOfTickets;

    // Default constructor (required by JPA)
    public Booking() {}

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getEventId() { return eventId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getDepartment() { return department; }
    public int getNumberOfTickets() { return numberOfTickets; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setDepartment(String department) { this.department = department; }
    public void setNumberOfTickets(int numberOfTickets) { this.numberOfTickets = numberOfTickets; }
}
