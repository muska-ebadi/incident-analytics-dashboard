# Phase 2: Conditional Rules Documentation

## Current Rules Implemented

### Rule 1: High Priority Based on Severity
- **Condition:** `if severity >= 3`
- **Action:** Risk score is calculated as `severity * 20`
  - Severity 3 = Risk Score 60 (Medium Risk)
  - Severity 4 = Risk Score 80 (High Risk)
  - Severity 5 = Risk Score 100 (High Risk)
- **Location:** `IncidentService.applyConditionalRules()`
- **Status:** ✅ Implemented (already calculated via riskScore)

### Rule 2: Warning State for Unresolved Incidents
- **Condition:** `if incident status != RESOLVED`
- **Action:** Frontend displays warning indicators (red/amber status badges)
- **Location:** Frontend status color mapping
- **Status:** ✅ Implemented (handled in UI)

## Future Rules (Design Only - Phase 3)

### Rule 3: Auto-Acknowledge High Severity
- **Condition:** `if severity >= 4 && status == OPEN`
- **Action:** Automatically set status to `ACKNOWLEDGED`
- **Implementation:** Add to `applyConditionalRules()` method

### Rule 4: Auto-Escalate Long-Running Incidents
- **Condition:** `if status == OPEN && duration > 24 hours`
- **Action:** Mark as high priority or notify escalation

### Rule 5: Severity-Based Risk Score Adjustment
- **Condition:** `if severity >= 4`
- **Action:** Additional risk score multiplier for critical incidents

## Integration Architecture (Phase 3 - Design Only)

### Webhook-Based Slack Notification

```java
// Future: IncidentService.java
public void notifySlack(Incident incident, String eventType) {
    // Webhook URL stored in config
    String webhookUrl = System.getenv("SLACK_WEBHOOK_URL");
    
    String message = String.format(
        "%s incident: %s (Severity: %d, Status: %s)",
        eventType, incident.getTitle(), 
        incident.getSeverity(), incident.getStatus()
    );
    
    // HTTP POST to Slack webhook
    // Implementation would use RestTemplate or WebClient
}
```

### Event-Driven Architecture
- **Event Types:** `INCIDENT_CREATED`, `INCIDENT_ACKNOWLEDGED`, `INCIDENT_RESOLVED`
- **Handler Pattern:** Each integration (Slack, Email, etc.) subscribes to events
- **Future Service Structure:**
  ```
  IncidentService
    ├── createIncident() → emits INCIDENT_CREATED event
    ├── updateStatus() → emits INCIDENT_ACKNOWLEDGED/RESOLVED event
    └── EventPublisher → notifies all registered handlers
  ```

### Slack Webhook Payload Example
```json
{
  "text": "⚠️ New Incident: Service Outage",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Incident Created*\n*Title:* Service Outage\n*Severity:* 4 (High)\n*Status:* OPEN"
      }
    }
  ]
}
```
