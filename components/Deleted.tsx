import { useEffect, useState } from "preact/hooks";
import IncidentComponent from "./IncidentComponent.tsx";
import LoadingIsland from "../islands/LoadingIsland.tsx";

type Incident = {
  _id?: string;
  id: string;
  pod: string;
  namespace: string;
  severity: string;
  alertCount: number;
  status: "open" | "quarantined" | "deleted";
};

const fetchIncidents = async () => {
  const response = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/data/incidents",
  );
  const data = await response.json();
  return data;
};

function Deleted() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetIncidents = async () => {
      try {
        setLoading(true);
        const data = await fetchIncidents();
        setIncidents(
          (data || []).filter((elem: Incident) => elem.status === "deleted"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetIncidents();
  }, []);

  if (loading) return <LoadingIsland />;

  return (
    <div style="margin-top:90px; margin-inline:30px">
      <p class="alerts-info">Deleted incidents</p>
      <div class="notifications-container">
        <div
          class="notifications-header"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            alignItems: "stretch",
          }}
        >
          {incidents.length === 0
            ? <p>No deleted incidents</p>
            : incidents.map((elem) => (
              <IncidentComponent
                data={elem}
                clickable={true}
                showDeleteButton={false}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Deleted;
