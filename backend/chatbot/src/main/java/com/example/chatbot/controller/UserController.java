package com.example.chatbot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.chatbot.model.dto.UserResponse;
import com.example.chatbot.model.entity.User;
import com.example.chatbot.service.JwtService;
import com.example.chatbot.service.LoginResponse;
import com.example.chatbot.service.UserService;

@RequestMapping("api/auth")
@RestController
public class UserController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);

        //mapping
        UserResponse response = new UserResponse();
        response.setId(createdUser.getId());
        response.setUsername(createdUser.getUsername());
        response.setEmail(createdUser.getEmail());
        response.setCreatedAt(createdUser.getCreatedAt());
        response.setUpdatedAt(createdUser.getUpdatedAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest){
        try{
            boolean isValid = userService.login(loginRequest.getUsername(),loginRequest.getPassword());
            if(isValid){
                String token = jwtService.generateToken(loginRequest.getUsername());
                User user = userService.getUserByUsername(loginRequest.getUsername());
                return ResponseEntity.ok(new LoginResponse(token, "Login successful", user.getId(), user.getUsername()));
            }
            else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(null, "Invalid credentials", null, null));
            }
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LoginResponse(null, "Login failed", null, null));
        }

    }

    public static class LoginRequest {
        private String username;
        private String password;

        public LoginRequest(String username, String password){
            this.username = username;
            this.password = password;
        }

        public String getUsername(){
            return username;
        }
        public void setUsername(String username){
            this.username = username;
        }

        public String getPassword(){
            return password;
        }
        public void setPassword(String password){
            this.password = password;
        }
            
    }
}
