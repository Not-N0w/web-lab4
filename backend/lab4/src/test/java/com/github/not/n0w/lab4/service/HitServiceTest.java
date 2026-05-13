package com.github.not.n0w.lab4.service;

import com.github.not.n0w.lab4.dto.HitRequestDto;
import com.github.not.n0w.lab4.dto.HitResponseDto;
import com.github.not.n0w.lab4.model.Hit;
import com.github.not.n0w.lab4.repository.HitRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class HitServiceTest {

    @Mock
    HitRepository hitRepository;

    @Mock
    AreaCheckService areaCheckService;

    @Mock
    SecurityService securityService;

    @InjectMocks
    HitService hitService;

    @Captor
    ArgumentCaptor<Hit> hitCaptor;

    @ParameterizedTest(name = "x={0}, y={1}, r={2}")
    @CsvSource({
            "0, 0, -1",
            "0, -0.5, -1",
            "1, 1, -1",
            "2, -2, -5",
            "0, -1, -1",
            "0, -1.0000000000000000000001, -1",
            "-100000000000, -10000000000, -1"
    })
    void hit(String x, String y, String r) {

        HitRequestDto dto = new HitRequestDto();
        dto.setX(new BigDecimal(x));
        dto.setY(new BigDecimal(y));
        dto.setR(new BigDecimal(r));

        when(securityService.currentUserId()).thenReturn("1");
        when(areaCheckService.checkArea(any(), any(), any())).thenReturn(true);

        hitService.hit(dto);

        verify(areaCheckService, times(1)).checkArea(dto.getX(), dto.getY(), dto.getR());
        verify(hitRepository, times(1)).save(hitCaptor.capture());

        Hit hit = hitCaptor.getValue();
        assertEquals(true, hit.getHit());
        assertEquals("1", hit.getUserId());
        assertEquals(dto.getX(), hit.getX());
        assertEquals(dto.getY(), hit.getY());
        assertEquals(dto.getR(), hit.getR());
    }

    boolean hitEquals(Hit hit, HitResponseDto dto) {
        return  hit.getX().equals(dto.getX()) &&
                hit.getY().equals(dto.getY()) &&
                hit.getR().equals(dto.getR()) &&
                hit.getHit().equals(dto.getHit()) &&
                hit.getCurrentTime().equals(dto.getCurrentTime()) &&
                hit.getExecutionTime().equals(dto.getExecutionTime());
    }

    @Test
    void getAll() {
        List<Hit> hits = List.of(
                new Hit(1L, "1", BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE, true, "2024-01-01 00:00:00", 0.001),
                new Hit(2L, "1", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ONE, false, "2024-01-01 00:00:01", 0.002)
        );

        when(securityService.currentUserId()).thenReturn("1");
        when(hitRepository.findByUserIdOrderByCurrentTimeAsc(any())).thenReturn(hits);

        List<HitResponseDto> responseHits = hitService.getAll();
        assertEquals(2, responseHits.size());
        assertTrue(hitEquals(hits.get(0), responseHits.get(0)) &&
                hitEquals(hits.get(1), responseHits.get(1))
        );
    }

    @Test
    void clear() {
        when(securityService.currentUserId()).thenReturn("1");
        hitService.clear();
        verify(hitRepository, times(1)).deleteAllByUserId(any());
    }
}