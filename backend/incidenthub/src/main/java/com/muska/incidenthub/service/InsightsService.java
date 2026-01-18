package com.muska.incidenthub.service;

import com.muska.incidenthub.model.Incident;
import com.muska.incidenthub.model.RiskSummary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InsightsService {
    private final IncidentService incidentService;

    public InsightsService(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    public RiskSummary getRiskSummary() {
        List<Incident> incidents = incidentService.getAllIncidents();
        
        int total = incidents.size();
        int highRisk = 0;
        int mediumRisk = 0;
        int lowRisk = 0;

        for (Incident incident : incidents) {
            int riskScore = incident.getRiskScore();
            if (riskScore >= 80) {
                highRisk++;
            } else if (riskScore >= 40) {
                mediumRisk++;
            } else {
                lowRisk++;
            }
        }

        return new RiskSummary(total, highRisk, mediumRisk, lowRisk);
    }
}
