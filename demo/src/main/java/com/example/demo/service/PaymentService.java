package com.example.demo.service;

import com.example.demo.entity.PaymentEntity;
import com.example.demo.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public PaymentEntity createPayment(PaymentEntity payment) {
        payment.setPaymentDate(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    public List<PaymentEntity> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<PaymentEntity> getPaymentsByUser(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    public Optional<PaymentEntity> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
