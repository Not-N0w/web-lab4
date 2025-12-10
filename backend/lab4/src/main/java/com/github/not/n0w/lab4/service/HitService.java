package com.github.not.n0w.lab4.service;

import com.github.not.n0w.lab4.dto.HitRequestDto;
import com.github.not.n0w.lab4.dto.HitResponseDto;
import com.github.not.n0w.lab4.model.Hit;
import com.github.not.n0w.lab4.repository.HitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HitService {
    private final HitRepository hitRepository;
    private final AreaCheckService areaCheckService;
    private final SecurityService securityService;

    @Transactional
    public void hit(HitRequestDto dto) {
        long timestamp = System.nanoTime();

        Boolean isHit = areaCheckService.checkArea(dto.getX(), dto.getY(), dto.getR());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        Hit hit = Hit.builder()
                .x(dto.getX())
                .y(dto.getY())
                .r(dto.getR())
                .currentTime(LocalDateTime.now().format(formatter))
                .hit(isHit)
                .userId(securityService.currentUserId())
                .executionTime((System.nanoTime() - timestamp) / 1_000_000_000.0)
                .build();

        hitRepository.save(hit);
    }

    @Transactional(readOnly = true)
    public List<HitResponseDto> getAll() {
        return hitRepository.findByUserId(securityService.currentUserId())
                .stream()
                .map(hit -> new HitResponseDto(
                        hit.getX(),
                        hit.getY(),
                        hit.getR(),
                        hit.getHit(),
                        hit.getCurrentTime(),
                        hit.getExecutionTime()
                ))
                .toList();
    }
    @Transactional(readOnly = true)
    public void clear() {
        hitRepository.deleteAllByUserId(securityService.currentUserId());
    }
}
