import { useEffect, useState } from "preact/hooks";
import { deletedPods, quarantinedPods } from "../signals.ts";
import LoadingIsland from "../islands/LoadingIsland.tsx";

interface AlertItem {
  output: string;
  containerid: string;
  containername: string;
  podname: string;
  namespace: string;
  username: string;
  useruid: string;
  priority: string;
  rule: string;
  time: string;
  tags: string[];
  status: "open" | "quarantined" | "deleted";
  quarantined: boolean;
  deleted: boolean;
}

interface IncidentStatus {
  pod: string;
  status: "open" | "quarantined" | "deleted";
}

interface QuarantinedPod {
  pod: string;
}

const fetchAlerts = async () => {
  const response = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/data/alerts",
  );
  return await response.json();
};

const fetchIncidents = async () => {
  const response = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/data/incidents",
  );
  return await response.json();
};

const fetchQuarantined = async () => {
  const response = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/data/quarantined",
  );
  return await response.json();
};

const fetchData = async () => {
  const [alerts, incidents, quarantined] = await Promise.all([
    fetchAlerts(),
    fetchIncidents(),
    fetchQuarantined(),
  ]);

  const statusByPod = new Map<string, IncidentStatus["status"]>();
  const quarantinedPods = new Set<string>();

  incidents.forEach((incident: IncidentStatus) => {
    statusByPod.set(incident.pod, incident.status);
  });

  quarantined.forEach((item: QuarantinedPod) => {
    quarantinedPods.add(item.pod);
  });

  return alerts.map((elem: any) => {
    let status: IncidentStatus["status"] = statusByPod.get(elem.podname) ||
      "open";

    if (status === "open" && quarantinedPods.has(elem.podname)) {
      status = "quarantined";
    }

    return {
      ...elem,
      status,
      quarantined: status === "quarantined",
      deleted: status === "deleted",
    } as AlertItem;
  });
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<AlertItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hiddenPods, setHiddenPods] = useState<Set<string>>(new Set());

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "Critical":
        return "✕";
      case "Warning":
        return "⚠";
      default:
        return "ℹ";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "Critical":
        return "#f80f0f";
      case "Warning":
        return "#fdec00";
      default:
        return "#585858";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const updateNotificationStatus = (
    podname: string,
    status: "open" | "quarantined" | "deleted",
  ) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.podname === podname
          ? {
            ...item,
            status,
            quarantined: status === "quarantined",
            deleted: status === "deleted",
          }
          : item
      )
    );
  };

  const deletePod = async (podname: string, namespace: string) => {
    const response = await fetch(
      "https://dynamicalerts.sergioom9.deno.net/pod/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pod: podname, namespace }),
      },
    );

    if (response.ok) {
      deletedPods.value += 1;
      updateNotificationStatus(podname, "deleted");
    }
  };

  const quarantinePod = async (podname: string, namespace: string) => {
    const response = await fetch(
      "https://dynamicalerts.sergioom9.deno.net/pod/quarantine",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pod: podname, namespace }),
      },
    );

    if (response.ok) {
      quarantinedPods.value += 1;
      updateNotificationStatus(podname, "quarantined");
    }
  };

  const dequarantinePod = async (podname: string, namespace: string) => {
    const response = await fetch(
      "https://dynamicalerts.sergioom9.deno.net/pod/quarantine",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pod: podname, namespace }),
      },
    );

    if (response.ok) {
      quarantinedPods.value = Math.max(0, quarantinedPods.value - 1);
      updateNotificationStatus(podname, "open");
    }
  };

  const dismissNotification = (podname: string) => {
    setHiddenPods((prev) => new Set(prev).add(podname));
  };

  useEffect(() => {
    const fetchAndSetStats = async () => {
      try {
        setLoading(true);
        const data = await fetchData();

        const uniqueAlertsMap = new Map<string, AlertItem>();
        data.forEach((alert: AlertItem) => {
          if (!uniqueAlertsMap.has(alert.podname)) {
            uniqueAlertsMap.set(alert.podname, alert);
          }
        });

        setNotifications(Array.from(uniqueAlertsMap.values()));
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetStats();
  }, []);

  if (loading) {
    return <LoadingIsland />;
  }

  const visibleNotifications = notifications.filter((item) =>
    !hiddenPods.has(item.podname)
  );

  return (
    <div class="notifications-container">
      <div class="notifications-header">
        <h2>Alerts</h2>
        <div class="notifications-actions">
          <button
            onClick={() => setIsOpen(!isOpen)}
            class="toggle-btn"
          >
            {isOpen ? "▼" : "▶"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div class="notifications-list">
          {visibleNotifications.length === 0
            ? (
              <div class="empty-state">
                <p>No notifications</p>
              </div>
            )
            : (
              visibleNotifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.podname}
                  class={`notification-item notification-${notification.priority.toLowerCase()}`}
                  style={{
                    overflow: "hidden",
                    borderRadius: "12px",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dismissNotification(notification.podname);
                    }}
                    aria-label="Hide alert"
                    class="delete-notification-btn"
                    style={{
                      zIndex: 30,
                      top: "10px",
                      left: "10px",
                      right: "auto",
                    }}
                  >
                    ×
                  </button>

                  {(notification.quarantined || notification.deleted) && (
                    <div
                      style={{
                        position: "absolute",
                        top: "24px",
                        right: "-56px",
                        background: notification.deleted
                          ? "linear-gradient(45deg, #dc2626, #ef4444)"
                          : "linear-gradient(45deg, #f59e0b, #f97316)",
                        color: "white",
                        width: "220px",
                        textAlign: "center",
                        padding: "8px 0",
                        transform: "rotate(45deg)",
                        fontSize: "13px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
                        zIndex: 20,
                        letterSpacing: "1px",
                        pointerEvents: "none",
                      }}
                    >
                      {notification.deleted ? "DELETED" : "QUARANTINED"}
                    </div>
                  )}

                  {(notification.quarantined || notification.deleted) && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(255, 255, 255, 0.18)",
                        backdropFilter: "blur(5px)",
                        borderRadius: "12px",
                        zIndex: 15,
                        pointerEvents: notification.quarantined
                          ? "auto"
                          : "none",
                        cursor: notification.quarantined
                          ? "not-allowed"
                          : "default",
                      }}
                      onClick={(e) => {
                        if (notification.quarantined) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    />
                  )}

                  <div
                    class="notification-icon"
                    style={{
                      background: `linear-gradient(135deg, ${
                        getNotificationColor(notification.priority)
                      }, ${getNotificationColor(notification.priority)}99)`,
                    }}
                  >
                    {getNotificationIcon(notification.priority)}
                  </div>

                  <div class="notification-content">
                    <div class="notification-header">
                      <span
                        class={`notification-badge ${notification.priority.toLowerCase()}`}
                      >
                        {notification.priority}
                      </span>
                      <span class="notification-priority">
                        Priority: {notification.priority}
                      </span>
                      <span class="notification-time">
                        {formatTimestamp(new Date(notification.time))}
                      </span>
                    </div>

                    <p class="notification-message">{notification.output}</p>

                    <div class="notification-details">
                      <div class="detail-row">
                        <span class="detail-label">Pod:</span>
                        <span class="detail-value">{notification.podname}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Container:</span>
                        <span class="detail-value">
                          {notification.containername}
                        </span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Namespace:</span>
                        <span class="detail-value">
                          {notification.namespace}
                        </span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">User:</span>
                        <span class="detail-value">
                          {notification.username}
                        </span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Rule:</span>
                        <span class="detail-value">{notification.rule}</span>
                      </div>
                      {notification.tags && notification.tags.length > 0 && (
                        <div class="detail-row">
                          <span class="detail-label">Tags:</span>
                          <div class="tags-container">
                            {notification.tags.map((tag) => (
                              <span key={tag} class="tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">{notification.status}</span>
                      </div>
                    </div>

                    <div
                      class="notification-actions"
                      style={{
                        pointerEvents: notification.quarantined
                          ? "none"
                          : "auto",
                        opacity: notification.quarantined ? 0.7 : 1,
                      }}
                    >
                      {notification.status === "quarantined" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dequarantinePod(
                              notification.podname,
                              notification.namespace,
                            );
                          }}
                          class="action-btn view-pod-btn"
                        >
                          ✅ Dequarantine
                        </button>
                      )}

                      <a
                        href={`/pod/${btoa(notification.podname)}`}
                        class="action-btn view-pod-btn"
                      >
                        View Pod
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (notification.status === "open") {
                            quarantinePod(
                              notification.podname,
                              notification.namespace,
                            );
                          }
                        }}
                        disabled={notification.status !== "open"}
                        class="action-btn quarantine-btn"
                      >
                        🔒 Quarantine Pod
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (notification.status !== "deleted") {
                            deletePod(
                              notification.podname,
                              notification.namespace,
                            );
                          }
                        }}
                        disabled={notification.status === "deleted"}
                        class="action-btn delete-pod-btn"
                      >
                        🗑️ Delete Pod
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
        </div>
      )}
    </div>
  );
}
