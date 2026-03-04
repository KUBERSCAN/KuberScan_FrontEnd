# KUBERSCAN - AlertPanel + DynamicAlerts

This repository contains:

- `AlertPanel`: Fresh/Preact frontend dashboard.
- `DynamicAlerts`: backend API (Express + MongoDB + Kubernetes client).

## Current Features (Updated)

### Frontend (AlertPanel)

- `/dashboard`
  - Alerts widget shows one alert per pod.
  - Status-aware cards (`open`, `quarantined`, `deleted`).
  - Quarantined/deleted visual overlay with diagonal ribbon.
  - `View Pod` button (`/pod/<base64-pod>`).
  - Local hide button `X` (only hides in dashboard view, does not modify DB).

- `/alerts`
  - Grouped by pod (latest alert).

- `/pod/<base64-pod>`
  - Shows pod alerts.
  - Persistent status from backend (`/data/incidents` + `/data/quarantined`).
  - Actions: `Quarantine Pod`, `Delete Pod`, `Dequarantine Pod` (when applicable).

- `/incidents`
  - Shows incidents individually (not grouped).
  - Each incident has:
    - `View Incident`
    - `Go To Pod`
    - `Delete Incident` (soft delete -> status `deleted`).

- `/incident/<base64-pod>`
  - Pod-specific incident detail.
  - Actions: quarantine/delete/dequarantine pod.
  - `Delete Incident` action available.

- `/quarantine`
  - Lists quarantined pods from backend.

- `/deleted`
  - Lists incidents with `status = deleted`.

### Backend (DynamicAlerts)

- Alert ingestion and incident generation.
- Quarantine/delete pod endpoints synchronized with incident status.
- Incident soft-delete (status update, not physical delete).
- Manual incident creation endpoint.

## API Endpoints

Base URL example:

- `https://dynamicalerts.sergioom9.deno.net`

### Alerts

- `POST /alert`
  - Ingests Falco alert.
  - Creates/updates incident automatically.

- `GET /data/alerts`
  - Returns alerts.

### Incidents

- `GET /data/incidents`
  - Returns incidents.

- `POST /incident`
  - Manual incident creation.
  - Body:
    ```json
    {
      "id": "sample-incident-001",
      "pod": "test-alert",
      "namespace": "default",
      "severity": "Critical",
      "alertCount": 1,
      "status": "open"
    }
    ```
  - Required: `id`, `pod`, `namespace`, `severity`.
  - Optional: `alertCount` (default `1`), `status` (default `open`).

- `DELETE /incident`
  - Soft delete incident(s): sets `status = deleted`.
  - Accepts one of:
    - `{ "_id": "..." }`
    - `{ "id": "..." }`
    - `{ "pod": "...", "namespace": "..." }`

### Pod actions

- `POST /pod/quarantine`
  - Quarantines pod and sets incident status to `quarantined`.

- `DELETE /pod/quarantine`
  - Dequarantines pod and sets incident status to `open`.

- `POST /pod/delete`
  - Deletes pod.
  - Removes matching entries from quarantined collection.
  - Deletes pod alerts.
  - Sets incident status to `deleted`.

### Quarantine data

- `GET /data/quarantined`
  - Returns quarantined pods.

## Notes

- Incident status enum in Mongo:
  - `open`
  - `quarantined`
  - `deleted`
- `Delete Incident` in UI is a soft delete (status change), not a physical removal.

## Dev

### AlertPanel

```bash
deno task dev
```

### DynamicAlerts

Run your backend as configured in your environment (Mongo URI + Kubernetes access as needed).
