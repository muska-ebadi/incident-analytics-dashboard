package com.muska.incidenthub.model;

public class RiskSummary {
    private int total;
    private int highRisk;
    private int mediumRisk;
    private int lowRisk;

    public RiskSummary() {}

    public RiskSummary(int total, int highRisk, int mediumRisk, int lowRisk) {
        this.total = total;
        this.highRisk = highRisk;
        this.mediumRisk = mediumRisk;
        this.lowRisk = lowRisk;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getHighRisk() {
        return highRisk;
    }

    public void setHighRisk(int highRisk) {
        this.highRisk = highRisk;
    }

    public int getMediumRisk() {
        return mediumRisk;
    }

    public void setMediumRisk(int mediumRisk) {
        this.mediumRisk = mediumRisk;
    }

    public int getLowRisk() {
        return lowRisk;
    }

    public void setLowRisk(int lowRisk) {
        this.lowRisk = lowRisk;
    }
}
