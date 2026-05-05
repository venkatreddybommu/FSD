package com.techfest.ticketbooking.repository;

import com.techfest.ticketbooking.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // JpaRepository provides findAll(), findById(), save(), etc. automatically
}
