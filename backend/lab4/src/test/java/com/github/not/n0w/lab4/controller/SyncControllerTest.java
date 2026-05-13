package com.github.not.n0w.lab4.controller;

import com.github.not.n0w.lab4.service.AreaCheckService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SyncControllerTest {

    @Mock
    SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    SyncController syncController;


    @Test
    void hit_needSync() {
        Principal principal = () -> "user1";
        syncController.hit("need_sync", principal);
        verify(messagingTemplate, times(1)).convertAndSendToUser(
                principal.getName(),
                "/queue/updates",
                "sync"
        );
    }

    @Test
    void hit_notNeedSync() {
        Principal principal = () -> "user1";
        syncController.hit("not_need_sync", principal);
        verify(messagingTemplate, times(0))
                .convertAndSendToUser(any(), any(), any());
    }
}