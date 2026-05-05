package com.techfest.ticketbooking.entity;

import jakarta.persistence.*;

// This class maps to the "events" table in H2 database
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String department;
    private String eventDate;   // stored as "YYYY-MM-DD" string for simplicity
    private String eventTime;   // stored as "HH:MM" string
    private String venue;
    private int ticketPrice;
    private int totalTickets;
    private int availableTickets;

    // Default constructor (required by JPA)
    public Event() {}

    // Constructor for seeding default data
    public Event(String name, String department, String eventDate, String eventTime,
                 String venue, int ticketPrice, int totalTickets) {
        this.name = name;
        this.department = department;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.venue = venue;
        this.ticketPrice = ticketPrice;
        this.totalTickets = totalTickets;
        this.availableTickets = totalTickets; // initially all tickets are available
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public String getEventDate() { return eventDate; }
    public String getEventTime() { return eventTime; }
    public String getVenue() { return venue; }
    public int getTicketPrice() { return ticketPrice; }
    public int getTotalTickets() { return totalTickets; }
    public int getAvailableTickets() { return availableTickets; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDepartment(String department) { this.department = department; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    public void setEventTime(String eventTime) { this.eventTime = eventTime; }
    public void setVenue(String venue) { this.venue = venue; }
    public void setTicketPrice(int ticketPrice) { this.ticketPrice = ticketPrice; }
    public void setTotalTickets(int totalTickets) { this.totalTickets = totalTickets; }
    public void setAvailableTickets(int availableTickets) { this.availableTickets = availableTickets; }
}
