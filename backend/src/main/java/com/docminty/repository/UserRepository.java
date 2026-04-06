package com.docminty.repository;
import com.docminty.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime; import java.util.List; import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRoleNot(User.Role role);
    long countByRoleNotAndPlan(User.Role role, User.Plan plan);
    long countByRoleNotAndCreatedAtAfter(User.Role role, LocalDateTime date);
    long countByStatus(User.UserStatus status);
    List<User> findAllByRoleNotOrderByCreatedAtDesc(User.Role role);
    @Query("SELECT u.state, COUNT(u) FROM User u GROUP BY u.state ORDER BY COUNT(u) DESC")
    List<Object[]> countByState();
}
