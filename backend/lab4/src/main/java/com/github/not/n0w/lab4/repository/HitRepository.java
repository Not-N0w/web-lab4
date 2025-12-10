package com.github.not.n0w.lab4.repository;

import com.github.not.n0w.lab4.model.Hit;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HitRepository extends CrudRepository<Hit, Long> {
    List<Hit> findByUserId(String userId);
    void deleteAllByUserId(String userId);
}
