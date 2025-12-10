package com.github.not.n0w.lab4.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AreaCheckService {
    public boolean checkArea(BigDecimal x, BigDecimal y, BigDecimal r) {
        BigDecimal zero = BigDecimal.ZERO;
        if(r.compareTo(zero) < 0) {
            r = r.negate();
            x = x.negate();
            y = y.negate();
        }

        BigDecimal rSquared = r.multiply(r);
        boolean isHit = false;

        if (x.compareTo(zero) <= 0 && y.compareTo(zero) >= 0) {
            boolean inXBounds = x.compareTo(r.negate()) >= 0;
            boolean inYBounds = y.compareTo(r) <= 0;

            if (inXBounds && inYBounds) {
                 isHit = true;
            }
        }

        if (x.compareTo(zero) <= 0 && y.compareTo(zero) <= 0) {
            BigDecimal sum = x.multiply(x).add(y.multiply(y));
            if (sum.compareTo(rSquared) <= 0) {
                isHit = true;
            }
        }

        if (x.compareTo(zero) >= 0 && y.compareTo(zero) <= 0) {
            BigDecimal border = x.subtract(r);

            if (y.compareTo(border) >= 0) {
                isHit = true;
            }
        }

        return isHit;
    }
}
