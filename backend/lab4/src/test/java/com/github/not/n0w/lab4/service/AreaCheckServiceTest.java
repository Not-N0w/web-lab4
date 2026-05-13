package com.github.not.n0w.lab4.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class AreaCheckServiceTest {

    AreaCheckService areaCheckService;

    @BeforeEach
    void setUp() {
        areaCheckService = new AreaCheckService();
    }

    @ParameterizedTest(name = "x={0}, y={1}, r={2} > {3}")
    @CsvSource({
            "0, 0, 1, true",
            "0, 0.5, 1, true",
            "1, 1, 1, false",
            "0, 0.9999999999999999, 1, true",
            "0, 1.0000000000000000000001, 1, false",
            "-2, 2, 5, true",
            "100000000000, 10000000000, 1, false"
    })
    void checkAreaPositiveR(String x, String y, String r, boolean expected) {
        BigDecimal xNumber = new BigDecimal(x);
        BigDecimal yNumber = new BigDecimal(y);
        BigDecimal rNumber = new BigDecimal(r);
        assertEquals(
                expected,
                areaCheckService.checkArea(xNumber, yNumber, rNumber)
        );
    }

    @ParameterizedTest(name = "x={0}, y={1}, r={2} > {3}")
    @CsvSource({
            "0, 0, -1, true",
            "0, -0.5, -1, true",
            "1, 1, -1, false",
            "2, -2, -5, true",
            "0, -1, -1, true",
            "0, -1.0000000000000000000001, -1, false",
            "-100000000000, -10000000000, -1, false"
    })
    void checkAreaNegativeR(String x, String y, String r, boolean expected) {
        BigDecimal xNumber = new BigDecimal(x);
        BigDecimal yNumber = new BigDecimal(y);
        BigDecimal rNumber = new BigDecimal(r);
        assertEquals(
                expected,
                areaCheckService.checkArea(xNumber, yNumber, rNumber)
        );
    }
}