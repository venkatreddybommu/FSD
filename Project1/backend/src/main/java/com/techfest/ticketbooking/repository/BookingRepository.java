package com.techfest.ticketbooking.repository;

import com.techfest.ticketbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// JpaRepository gives us save(), findAll(), findById(), deleteById() for free
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Fetch all bookings made by a specific user
    java.util.List<Booking> findByUserId(Long userId);
}
