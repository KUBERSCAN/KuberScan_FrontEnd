import { useEffect, useState } from "preact/hooks";
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

type IncidentStatus = {
  pod: string;
  namespace: string;
  status: "open" | "quarantined" | "deleted";
};

type QuarantineItem = {
  pod: string;
  namespace: string;
};

const fetchAlertsByPod = async (pod: string) => {
  const response = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/data/alerts",
  );
  const data = await response.json();
  return data.filter((elem: Alert) => elem.podname === pod);
};

const fetchPodState = async (pod: string) => {
  const [incidentsRes, quarantinedRes] = await Promise.all([
    fetch("https://dynamicalerts.sergioom9.deno.net/data/incidents"),
    fetch("https://dynamicalerts.sergioom9.deno.net/data/quarantined"),
  ]);

  const incidents: IncidentStatus[] = await incidentsRes.json();
  const quarantined: QuarantineItem[] = await quarantinedRes.json();

  const incident = incidents.find((elem) => elem.pod === pod);
  if (incident) {
    return {
      namespace: incident.namespace,
      status: incident.status,
    };
  }

  const quarantinedPod = quarantined.find((elem) => elem.pod === pod);
  if (quarantinedPod) {
    return {
      namespace: quarantinedPod.namespace,
      status: "quarantined" as const,
    };
  }

  return { namespace: "", status: "open" as const };
};

const getDecodedPodFromPath = () => {
  const pathname = globalThis.location?.pathname;
  if (!pathname) return "";

  const encoded = pathname.split("/")[2] || "";
  if (!encoded) return "";

  try {
    return atob(encoded);
  } catch (_e) {
    return "";
  }
};

const GroupAlert = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [pod, setPod] = useState<string>("");
  const [namespace, setNamespace] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<
    "open" | "quarantined" | "deleted"
  >("open");

  const applyStatus = (status: "open" | "quarantined" | "deleted") => {
    setCurrentStatus(status);
    setAlerts((prev) => prev.map((elem: Alert) => ({ ...elem, status })));
  };

  const deletePod = async () => {
    if (!pod || !namespace) return;

    const response = await fetch(
      "https://dynamicalerts.sergioom9.deno.net/pod/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pod, namespace }),
      },
    );

    if (response.ok) {
      deletedPods.value += 1;
      applyStatus("deleted");
      setAlerts([]);
    }
  };

  const quarantinePod = async () => {
    if (!pod || !namespace) return;

    const response = await fetch(
      "https://dynamicalerts.sergioom9.deno.net/pod/quarantine",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pod, namespace }),
      },
    );

    if (response.ok) {
      quarantinedPods.value += 1;
      applyStatus("quarantined");
    }
  };

  const dequarantinePod = async () => {
    if (!pod || !namespace) return;

    const response = await fetch(
      "https://dynamicalerts.sergioom9.deno.net/pod/quarantine",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pod, namespace }),
      },
    );

    if (response.ok) {
      quarantinedPods.value = Math.max(0, quarantinedPods.value - 1);
      applyStatus("open");
    }
  };

  useEffect(() => {
    const fetchAndSetPodData = async () => {
      try {
        setLoading(true);

        const decodedPod = getDecodedPodFromPath();
        if (!decodedPod) {
          setPod("");
          setNamespace("");
          applyStatus("open");
          return;
        }

        const [alertData, podState] = await Promise.all([
          fetchAlertsByPod(decodedPod),
          fetchPodState(decodedPod),
        ]);

        setPod(decodedPod);
        setAlerts(alertData);
        setNamespace(
          alertData.length > 0 ? alertData[0].namespace : podState.namespace,
        );
        applyStatus(podState.status);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetPodData();
  }, []);

  if (loading) {
    return <LoadingIsland />;
  }

  return (
    <div style={{ marginTop: "100px", marginInline: "30px" }}>
      <div class="notification-actions pod-header-row">
        <div class="pod-title-wrap">
          <span class="alerts-info pod-title">{pod}</span>
          <span class="count-badge">{alerts.length} alerts</span>
        </div>

        {currentStatus === "quarantined" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              dequarantinePod();
            }}
            class="action-btn view-pod-btn"
          >
            ✅ Dequarantine Pod
          </button>
        )}

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
          class="status-banner"
          style={{
            background: currentStatus === "deleted"
              ? "rgba(239, 68, 68, 0.1)"
              : "rgba(245, 158, 11, 0.1)",
            border: currentStatus === "deleted"
              ? "2px solid rgba(239, 68, 68, 0.5)"
              : "2px solid rgba(245, 158, 11, 0.5)",
            color: currentStatus === "deleted" ? "#fca5a5" : "#fbbf24",
          }}
        >
          {currentStatus === "deleted"
            ? "⛔ DELETED - No more actions allowed"
            : "🔒 QUARANTINED - You can still delete or dequarantine"}
        </div>
      )}

      <div class="incidents-stack" style={{ marginTop: "20px" }}>
        {alerts.length === 0
          ? (
            <p
              style={{
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "16px",
              }}
            >
              No alerts found for this pod
            </p>
          )
          : (
            alerts.map((elem) => (
              <AlertComponent data={elem} clickable={false} />
            ))
          )}
      </div>
    </div>
  );
};

export default GroupAlert;
