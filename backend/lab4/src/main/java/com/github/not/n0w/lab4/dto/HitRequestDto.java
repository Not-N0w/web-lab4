package com.github.not.n0w.lab4.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HitRequestDto {
    private BigDecimal x;
    private BigDecimal y;
    private BigDecimal r;
}
