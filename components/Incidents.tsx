import { useEffect, useState } from "preact/hooks";
import IncidentComponent from "./IncidentComponent.tsx";

type Incident = {
  id: string,
  pod: string,
  namespace: string,
  firstSeen: string,
  lastSeen: string,
  severity: string,
  alertCount: number,
  status: "open" | "quarantined" | "resolved"
}


const fetchIncidents = async () => {
    const response = await fetch('https://dynamicalerts.sergioom9.deno.net/incidents');
    const data = undefined; //await response.json();
    return data;
}


function Incidents() {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        const fetchAndSetIncidents = async () => {
            const incidents = await fetchIncidents();
            setIncidents(incidents || []);
        };
        fetchAndSetIncidents();
    }, []);

  return (
    <div>
        <h5>Total Incidents {incidents.length}</h5>
        {incidents.map((incident) => (
            <IncidentComponent data={incident} />
        ))}
    </div>
  );
}
export default Incidents;