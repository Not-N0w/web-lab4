package com.github.not.n0w.lab4.controller;

import com.github.not.n0w.lab4.dto.HitRequestDto;
import com.github.not.n0w.lab4.dto.HitResponseDto;
import com.github.not.n0w.lab4.service.HitService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class HitControllerTest {
    @Mock
    HitService hitService;

    @InjectMocks
    HitController hitController;

    MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(hitController).build();
    }

    @Test
    void hit() throws Exception {
        mockMvc.perform(post("/hits/hit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"x\":0,\"y\":0,\"r\":1}")
        ).andExpect(status().isOk());

        verify(hitService, times(1)).hit(any());
    }

    @Test
    void hit_letters() throws Exception {
        mockMvc.perform(post("/hits/hit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"x\":\"a\",\"y\":0,\"r\":1}")
        ).andExpect(status().isBadRequest());

        verify(hitService, times(0)).hit(any());
    }

    @Test
    void hit_emptyBody() throws Exception {
        mockMvc.perform(post("/hits/hit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
        ).andExpect(status().isBadRequest());

        verify(hitService, times(0)).hit(any());
    }

    @Test
    void all() throws Exception {
        HitResponseDto dto = new HitResponseDto();
        dto.setX(BigDecimal.ZERO);
        dto.setY(BigDecimal.ZERO);
        dto.setR(BigDecimal.ONE);

        List<HitResponseDto> hits = List.of(dto);
        when(hitService.getAll()).thenReturn(hits);

        mockMvc.perform(get("/hits/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].x").value(0))
                .andExpect(jsonPath("$[0].y").value(0))
                .andExpect(jsonPath("$[0].r").value(1));

        verify(hitService, times(1)).getAll();
    }


    @Test
    void clearAll() throws Exception {
        mockMvc.perform(delete("/hits/clear"))
                .andExpect(status().isOk());

        verify(hitService, times(1)).clear();
    }
}