package com.example.demo.controller;

import com.example.demo.entity.VendorBookingEntity;
import com.example.demo.repository.VendorBookingRepository;
import com.example.demo.service.RazorpayService;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final VendorBookingRepository vendorBookingRepository;
    private final RazorpayService razorpayService;

    public PaymentController(VendorBookingRepository vendorBookingRepository, RazorpayService razorpayService) {
        this.vendorBookingRepository = vendorBookingRepository;
        this.razorpayService = razorpayService;
    }

    @PostMapping("/createOrder")
    public ResponseEntity<JSONObject> createOrder(@RequestBody Map<String, Object> body) {
        JSONObject response = new JSONObject();
        try {
            String type = (String) body.get("type"); // "EVENT" or "VENDOR"
            Long bookingId = body.get("bookingId") != null ? Long.valueOf(body.get("bookingId").toString()) : null;
            double amount = 0;

            // 1️⃣ Use provided amount if available
            if (body.get("amount") != null) {
                amount = Double.parseDouble(body.get("amount").toString());
            }

            // 2️⃣ Fetch booking amount if bookingId is provided
            if (bookingId != null) {
                VendorBookingEntity booking = vendorBookingRepository.findById(bookingId)
                        .orElseThrow(() -> new BookingNotFoundException("Booking not found for ID: " + bookingId));

                if (booking.getPrice() <= 0) {
                    throw new InvalidBookingAmountException("Booking price is missing or invalid for ID: " + bookingId);
                }

                amount = booking.getPrice();
            }

            // 3️⃣ Validate amount
            if (amount <= 0) {
                throw new InvalidBookingAmountException("Amount must be greater than 0. Computed amount: " + amount);
            }

            logger.debug("Creating order - type: {}, bookingId: {}, amount: {}", type, bookingId, amount);

            // 4️⃣ Create Razorpay order
            response = razorpayService.createOrder(amount);
            return ResponseEntity.ok(response);

        } catch (RazorpayException e) {
            logger.error("Razorpay error: ", e);
            response.put("error", "Razorpay error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (BookingNotFoundException | InvalidBookingAmountException e) {
            logger.warn("Booking error: ", e);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("Unexpected error: ", e);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ✅ Custom exceptions for clarity
    static class BookingNotFoundException extends RuntimeException {
        public BookingNotFoundException(String message) { super(message); }
    }

    static class InvalidBookingAmountException extends RuntimeException {
        public InvalidBookingAmountException(String message) { super(message); }
    }
}