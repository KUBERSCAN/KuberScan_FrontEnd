import { useState, useEffect } from "preact/hooks";
import { deletedPods, quarantinedPods } from "../signals.ts";
import AlertComponent from "./AlertComponent.tsx";
import LoadingIsland from "../islands/LoadingIsland.tsx";

type Alert = {
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
  source: string;
  tags: string[];
  status?: "open" | "quarantined" | "deleted";
};

const fetchAlerts = async () => {
  const pathParts = globalThis.location.pathname.split("/");
  const id = atob(pathParts[2]);
  const response = await fetch('https://dynamicalerts.sergioom9.deno.net/data/alerts');
  const data = await response.json();
  const filteredData = data.filter((elem: Alert) => elem.podname === id);
  const finalData = filteredData.map((elem: Alert) => ({
    ...elem,
    status: "open" as const
  }));
  return finalData;
}

const GroupAlert = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [pod, setPod] = useState<string>("");
  const [namespace, setNamespace] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<"open" | "quarantined" | "deleted">("open");

  const deletePod = () => {
    deletedPods.value += 1;
    setCurrentStatus("deleted");
    setAlerts(alerts.map((elem: Alert) => ({
      ...elem,
      status: "deleted" as const
    })));
  };

  const quarantinePod = () => {
    quarantinedPods.value += 1;
    setCurrentStatus("quarantined");
    setAlerts(alerts.map((elem: Alert) => ({
      ...elem,
      status: "quarantined" as const
    })));
  };

  useEffect(() => {
    const fetchandsetAlerts = async () => {
      try {
        setLoading(true);
        const alerts = await fetchAlerts();
        setAlerts(alerts);
        if (alerts.length > 0) {
          setPod(alerts[0].podname);
          setNamespace(alerts[0].namespace);
          setCurrentStatus(alerts[0].status || "open");
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchandsetAlerts();
  }, []);

  if (loading) {
    return <LoadingIsland />;
  }

  return (
    <div style={{ marginTop: "100px", marginInline: "30px" }}>
      <div class="notification-actions">
        <span
          class="alerts-info"
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
        >
          {pod}
        </span>

        <button
          style={{
            maxHeight: "70px",
            opacity: currentStatus !== "open" ? 0.5 : 1,
            cursor: currentStatus !== "open" ? "not-allowed" : "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (currentStatus === "open") {
              quarantinePod();
            }
          }}
          disabled={currentStatus !== "open"}
          class="action-btn quarantine-btn"
        >
          🔒 Quarantine Pod
        </button>

        <button
          style={{
            maxHeight: "70px",
            opacity: currentStatus === "deleted" ? 0.5 : 1,
            cursor: currentStatus === "deleted" ? "not-allowed" : "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (currentStatus !== "deleted") {
              deletePod();
            }
          }}
          disabled={currentStatus === "deleted"}
          class="action-btn delete-pod-btn"
        >
          🗑️ Delete Pod
        </button>
      </div>

      {currentStatus !== "open" && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            background: currentStatus === "deleted"
              ? "rgba(239, 68, 68, 0.1)"
              : "rgba(245, 158, 11, 0.1)",
            border: currentStatus === "deleted"
              ? "2px solid rgba(239, 68, 68, 0.5)"
              : "2px solid rgba(245, 158, 11, 0.5)",
            color: currentStatus === "deleted" ? "#fca5a5" : "#fbbf24",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {currentStatus === "deleted"
            ? "⛔ DELETED - No more actions allowed"
            : "🔒 QUARANTINED - You can still delete"}
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        {alerts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "16px" }}>
            No alerts found for this pod
          </p>
        ) : (
          alerts.map((elem, index) => (
            <AlertComponent 
              data={elem} 
              clickable={false}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default GroupAlert;