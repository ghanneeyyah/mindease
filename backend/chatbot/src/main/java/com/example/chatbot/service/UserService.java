package com.example.chatbot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.chatbot.exception.domain.UserNotFound;
import com.example.chatbot.model.entity.User;
import com.example.chatbot.repository.UserRepo;

@Service
public class UserService implements UserDetailsService{
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordService passwordService;

    public User createUser(User user){
        String hashPassword = passwordService.hashPassword(user.getPasswordHash());
        user.setPasswordHash(hashPassword);
        return userRepo.save(user);
    }

    public boolean login(String username, String plainPassword){
        User userFound = userRepo.findByUsername(username).orElseThrow(()-> new UserNotFound(username));
        
        return passwordService.checkPassword(plainPassword, userFound.getPasswordHash());        
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username).orElseThrow(()-> new UserNotFound(username));
        

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .authorities("USER")   // later you can add roles/permissions
                .build();
    }

    public User getUserByUsername(String username) {
        return userRepo.findByUsername(username).orElseThrow(() -> new UserNotFound(username));
    }
}
