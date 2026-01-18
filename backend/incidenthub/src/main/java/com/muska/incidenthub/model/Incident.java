package com.muska.incidenthub.model;

import java.time.LocalDate;

public class Incident {
    private Long id;
    private String title;
    private String type;      // AUTO, HOME, CYBER, FRAUD, OUTAGE, OTHER
    private int severity;     // 1-5
    private String status;    // OPEN, IN_PROGRESS, RESOLVED
    private LocalDate date;   // yyyy-mm-dd
    private String description;
    private int riskScore;


    public Incident() {}

    public Incident(Long id, String title, String type, int severity, String status, LocalDate date, String description) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.severity = severity;
        this.status = status;
        this.date = date;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getSeverity() { return severity; }
    public void setSeverity(int severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

}
