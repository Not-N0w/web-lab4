package com.github.not.n0w.lab4.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HitResponseDto {
    private BigDecimal x;
    private BigDecimal y;
    private BigDecimal r;
    private Boolean hit;
    private String currentTime;
    private Double executionTime;

    @Override
    public String toString() {
        return "{" +
                "\"x\":" + x + "," +
                "\"y\":" + y + "," +
                "\"r\":" + r + "," +
                "\"hit\":" + hit + "," +
                "\"currentTime\":\"" + currentTime + "\"," +
                "\"executionTime\":" + executionTime +
                "}";
    }
}
