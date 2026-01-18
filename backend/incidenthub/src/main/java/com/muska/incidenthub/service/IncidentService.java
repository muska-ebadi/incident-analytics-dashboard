package com.muska.incidenthub.service;

import com.muska.incidenthub.model.Incident;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class IncidentService {
    private final List<Incident> incidents = new ArrayList<>();
    private long nextId = 1;

    public List<Incident> getAllIncidents() {
        return incidents;
    }

    public Incident createIncident(Incident incident) {
        incident.setId(nextId++);
        incident.setRiskScore(incident.getSeverity() * 20);
        // Apply conditional rules
        applyConditionalRules(incident);
        incidents.add(incident);
        return incident;
    }

    public Incident updateIncidentStatus(Long id, String status) {
        Incident incident = incidents.stream()
            .filter(i -> i.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Incident not found"));
        
        incident.setStatus(status);
        // Re-apply rules when status changes
        applyConditionalRules(incident);
        return incident;
    }

    private void applyConditionalRules(Incident incident) {
        // Phase 2: Conditional rules
        // Rule 1: If severity >= 3, mark as high priority (this is already handled by riskScore)
        if (incident.getSeverity() >= 3) {
            // Risk score already calculated as severity * 20
            // High priority is reflected in riskScore >= 60
        }
        
        // Rule 2: If incident not resolved, ensure warning state
        // This is handled in frontend display logic
        
        // Rule 3: Auto-set status based on severity (optional)
        // Could add: if severity >= 4 && status is OPEN, auto-acknowledge
    }
}
