package com.example.demo.controller;

import com.example.demo.entity.UserEntity;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // adjust if your frontend port differs
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // ✅ Signup
    @PostMapping("/signup")
    public String signup(@RequestBody UserEntity user) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "❌ Email already registered!";
        }

        // Default role = USER if not given
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        userRepository.save(user);
        return "✅ Signup successful as " + user.getRole();
    }

    // ✅ Login (role-based)
    @PostMapping("/login")
    public Object login(@RequestBody UserEntity loginRequest) {
        Optional<UserEntity> user = userRepository.findByEmail(loginRequest.getEmail());

        if (user.isEmpty()) {
            return "❌ Invalid email!";
        }

        UserEntity foundUser = user.get();

        if (!foundUser.getPassword().equals(loginRequest.getPassword())) {
            return "❌ Invalid password!";
        }

        // ✅ Return role info so frontend can redirect correctly
        return new LoginResponse(
                "✅ Login successful",
                foundUser.getRole(),
                foundUser.getName(),
                foundUser.getId()
        );
    }

    // ✅ Response class
    static class LoginResponse {
        public String message;
        public String role;
        public String name;
        public Long userId;

        public LoginResponse(String message, String role, String name, Long userId) {
            this.message = message;
            this.role = role;
            this.name = name;
            this.userId = userId;
        }
    }
}
