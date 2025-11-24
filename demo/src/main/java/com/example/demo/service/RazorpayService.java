package com.example.demo.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    private final RazorpayClient client;

    public RazorpayService(
            @Value("${razorpay.key_id}") String keyId,
            @Value("${razorpay.key_secret}") String keySecret
    ) throws RazorpayException {
        // Initialize Razorpay client once
        this.client = new RazorpayClient(keyId, keySecret);
    }

    /**
     * Creates a Razorpay order with the given amount (in rupees)
     *
     * @param amount Amount in rupees
     * @return JSONObject with orderId, amount in paise, and currency
     * @throws RazorpayException if Razorpay order creation fails
     */
    public JSONObject createOrder(double amount) throws RazorpayException {
        // Convert amount to paise
        long amountPaise = Math.round(amount * 100);

        // Build order request
        JSONObject options = new JSONObject();
        options.put("amount", amountPaise);          // amount in paise
        options.put("currency", "INR");
        options.put("receipt", "rcpt_" + System.currentTimeMillis());
        options.put("payment_capture", 1);          // auto-capture payment

        // Create order via Razorpay API
        Order order = client.orders.create(options);

        // Build JSON response
        JSONObject response = new JSONObject();
        response.put("orderId", order.get("id").toString());
        response.put("amount", amountPaise);
        response.put("currency", "INR");

        return response;
    }
}
