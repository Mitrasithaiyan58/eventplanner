package com.example.demo.service;

import com.example.demo.entity.UserEntity;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public UserEntity getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Create user
    public UserEntity createUser(UserEntity user) {
        // Save password as well
        return userRepository.save(user);
    }

    // Update user
    public UserEntity updateUser(Long id, UserEntity user) {
        UserEntity existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPhone(user.getPhone());
            existingUser.setPassword(user.getPassword()); // <-- Set password
            return userRepository.save(existingUser);
        }
        return null;
    }

    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
