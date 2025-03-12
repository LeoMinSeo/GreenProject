package com.green.project.Leo.repository.concert;

import com.green.project.Leo.entity.concert.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket,Long> {
}
