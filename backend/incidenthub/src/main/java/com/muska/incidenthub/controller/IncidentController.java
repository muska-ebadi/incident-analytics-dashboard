package com.muska.incidenthub.controller;

import com.muska.incidenthub.model.Incident;
import com.muska.incidenthub.service.IncidentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {
    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public List<Incident> getAll() {
        return incidentService.getAllIncidents();
    }

    @PostMapping
    public Incident create(@RequestBody Incident incident) {
        return incidentService.createIncident(incident);
    }

    @PatchMapping("/{id}/status")
    public Incident updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return incidentService.updateIncidentStatus(id, request.getStatus());
    }

    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
