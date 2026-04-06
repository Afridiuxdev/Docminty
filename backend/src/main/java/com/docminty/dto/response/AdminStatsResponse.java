package com.docminty.dto.response;
import lombok.*;
import java.util.Map;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class AdminStatsResponse { private long totalUsers; private long proUsers; private long freeUsers; private long newUsersThisMonth; private long totalDocuments; private long documentsToday; private long documentsThisMonth; private long totalRevenue; private long revenueThisMonth; private long totalPayments; private Map<String,Long> docTypeBreakdown; }
