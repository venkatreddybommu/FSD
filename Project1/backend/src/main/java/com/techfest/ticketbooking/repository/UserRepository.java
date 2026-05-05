package com.techfest.ticketbooking.repository;

import com.techfest.ticketbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA auto-generates the SQL query from this method name
    Optional<User> findByUsername(String username);
}
