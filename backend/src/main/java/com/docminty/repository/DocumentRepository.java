package com.docminty.repository;

import com.docminty.model.Document;
import com.docminty.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findAllByOrderByCreatedAtDesc();
    List<Document> findByUserOrderByCreatedAtDesc(User user);
    List<Document> findByUser_IdOrderByCreatedAtDesc(Long userId);
    List<Document> findByUserAndDocTypeOrderByCreatedAtDesc(User user, String docType);
    Optional<Document> findByReferenceNumber(String referenceNumber);
    Optional<Document> findByShareToken(String shareToken);
    long countByUser(User user);
    long countByCreatedAtAfter(LocalDateTime date);

    @Query("SELECT d.docType, COUNT(d) FROM Document d GROUP BY d.docType ORDER BY COUNT(d) DESC")
    List<Object[]> countByDocType();

    @Query("SELECT COUNT(d) FROM Document d WHERE d.createdAt > :date")
    long countTodayDocuments(@Param("date") LocalDateTime date);
}