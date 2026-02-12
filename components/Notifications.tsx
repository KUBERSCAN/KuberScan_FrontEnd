import { useEffect, useState } from "preact/hooks";
import { deletedPods, quarantinedPods } from "../signals.ts";
import LoadingIsland from "../islands/LoadingIsland.tsx";
interface Alerts {
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
  quarantined: boolean;
  deleted: boolean;
}


const fetchData = async () => {
  const alerts = await fetchAlerts();
  const mappedalerts = alerts.map((elem: any) => ({
    ...elem,
    quarantined: false, 
    deleted: false,    
  }));
  return mappedalerts
};

const fetchAlerts = async () => {
  const response = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/data/alerts",
  );
  const data = await response.json();
  return data;
};


export default function Notifications() {
  const [notifications, setNotifications] = useState<Alerts[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading,setLoading] = useState(true)

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

  const deletePod = (podname: string, namespace: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.podname === podname && n.namespace === namespace
          ? { ...n, deleted: true }
          : n
      )
    );
    deletedPods.value += 1;
  };

  const quarantinePod = (podname: string, namespace: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.podname === podname && n.namespace === namespace
          ? { ...n, quarantined: true }
          : n
      )
    );
    quarantinedPods.value += 1;
  };

  useEffect(() => {
  const fetchAndSetStats = async () => {
    setLoading(true)
    const data = await fetchData(); 

    const uniqueAlertsMap = new Map<string, Alerts>();
    data.forEach((alert:Alerts) => {
      if (!uniqueAlertsMap.has(alert.podname)) {
        uniqueAlertsMap.set(alert.podname, alert);
      }
    });

    const uniqueAlerts = Array.from(uniqueAlertsMap.values());

    setNotifications(uniqueAlerts);
  };

  fetchAndSetStats();
  setLoading(false)
}, []);

if (loading) {
    return <LoadingIsland />;
  }

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
          {notifications.length === 0
            ? (
              <div class="empty-state">
                <p>No notifications</p>
              </div>
            )
            : (
              notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.podname}
                  class={`notification-item notification-${notification.priority.toLowerCase()}`}
                >
                  {(notification.quarantined || notification.deleted) && (
                    <div
                      style={{
                        position: "absolute",
                        top: "30px",
                        right: "-35px",
                        background: "linear-gradient(45deg, #f59e0b, #f97316)",
                        color: "white",
                        padding: "8px 50px",
                        transform: "rotate(45deg)",
                        fontSize: "14px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                        zIndex: 10,
                        letterSpacing: "1px",
                      }}
                    >
                      SOLVED
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
                        background: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(2px)",
                        zIndex: 5,
                        pointerEvents: "none",
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
                        <span class="detail-label">Quarantined:</span>
                        <span class="detail-value">
                          {notification.quarantined ? "Yes" : "No"}
                        </span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Deleted:</span>
                        <span class="detail-value">
                          {notification.deleted ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div class="notification-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          quarantinePod(
                            notification.podname,
                            notification.namespace,
                          );
                        }}
                        class="action-btn quarantine-btn"
                      >
                        🔒 Quarantine Pod
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePod(
                            notification.podname,
                            notification.namespace,
                          );
                        }}
                        class="action-btn delete-pod-btn"
                      >
                        🗑️ Delete Pod
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          <button
            class="mark-all-btn"
            onClick={(e) => globalThis.location.href = "/alerts"}
          >
            See All
          </button>
        </div>
      )}
    </div>
  );
}
