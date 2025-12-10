package com.github.not.n0w.lab4.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class SyncController {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/hit")
    public void hit(@Payload String payload, Principal principal) {
        if ("need_sync".equals(payload)) {
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/updates",
                    "sync"
            );
        }
    }
}
