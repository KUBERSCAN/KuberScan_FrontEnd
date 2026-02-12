import { useEffect, useState } from "preact/hooks";
import IncidentComponent from "./IncidentComponent.tsx";
import { deletedPods, quarantinedPods } from "../signals.ts";
import LoadingIsland from "../islands/LoadingIsland.tsx";
type Incident = {
  id: string,
  pod: string,
  namespace: string,
  firstSeen: string,
  lastSeen: string,
  severity: string,
  alertCount: number,
  status: "open" | "quarantined" | "deleted"
}

const fetchIncident = async () => {
  const pathParts = globalThis.location.pathname.split("/");
  const id = atob(pathParts[2]);
  const response = await fetch('https://dynamicalerts.sergioom9.deno.net/data/incidents');
  const data = await response.json();
  const filteredData = data.filter((elem: Incident) => elem.pod === id);
  return filteredData;
}

function GroupIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [pod, setPod] = useState<string>("");
  const [namespace, setNamespace] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<"open" | "quarantined" | "deleted">("open");
    const [loading,setLoading] = useState(true)
  const deletePod = () => {
    deletedPods.value += 1;
    setCurrentStatus("deleted");
    setIncidents(incidents.map((elem: Incident) => ({
      ...elem,
      status: "deleted" as const
    })));
  };

  const quarantinePod = () => {
    quarantinedPods.value += 1;
    setCurrentStatus("quarantined");
    setIncidents(incidents.map((elem: Incident) => ({
      ...elem,
      status: "quarantined" as const
    })));
  };

  useEffect(() => {
    const fetchandsetIncidents = async () => {
     try{
        setLoading(true)
        const incidents = await fetchIncident();
        setIncidents(incidents);
        if (incidents.length > 0) {
        setPod(incidents[0].pod);
        setNamespace(incidents[0].namespace);
        setCurrentStatus(incidents[0].status); 
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }finally{
        setLoading(false)
      }
    };
    fetchandsetIncidents();
  }, []);
if(loading){return <LoadingIsland />}
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
        class="notifications-container"
        style={{ marginTop: "20px" }}
      >
        <div class="notifications-header">
          {incidents.length === 0 ? (
            <p>No incidents found for this pod</p>
          ) : (
            incidents.map((elem, index) => (
              <IncidentComponent key={index} data={elem} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupIncidents;