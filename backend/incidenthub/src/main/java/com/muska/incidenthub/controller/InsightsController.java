package com.muska.incidenthub.controller;

import com.muska.incidenthub.model.RiskSummary;
import com.muska.incidenthub.service.InsightsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insights")
public class InsightsController {
    private final InsightsService insightsService;

    public InsightsController(InsightsService insightsService) {
        this.insightsService = insightsService;
    }

    @GetMapping("/risk-summary")
    public RiskSummary getRiskSummary() {
        return insightsService.getRiskSummary();
    }
}
