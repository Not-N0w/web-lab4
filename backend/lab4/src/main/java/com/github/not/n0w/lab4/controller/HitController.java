package com.github.not.n0w.lab4.controller;

import com.github.not.n0w.lab4.dto.HitRequestDto;
import com.github.not.n0w.lab4.dto.HitResponseDto;
import com.github.not.n0w.lab4.service.HitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/hits")
@RequiredArgsConstructor
public class HitController {
    private final HitService hitService;

    @PostMapping("hit")
    public void hit(@RequestBody HitRequestDto hit) {
        hitService.hit(hit);
    }

    @GetMapping("all")
    public List<HitResponseDto> all() {
        return hitService.getAll();
    }

    @DeleteMapping("clear")
    public void clearAll() {
        hitService.clear();
    }


    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleInvalidHitRequest(HttpMessageNotReadableException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Invalid request body. Check x, y, and r values.");
    }

}
