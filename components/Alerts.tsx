import { useEffect, useState } from "preact/hooks";
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
};

const fetchAlerts = async () => {
  const response = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/data/alerts",
  );
  const data = await response.json();
  return data;
};

function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetAlerts = async () => {
      try {
        setLoading(true);
        const alerts = await fetchAlerts();
        setAlerts(alerts || []);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetAlerts();
  }, []);

  const groupedAlerts = Object.values(
    alerts.reduce((acc, alert) => {
      if (!acc[alert.podname]) {
        acc[alert.podname] = alert;
      }
      return acc;
    }, {} as Record<string, Alert>),
  );

  if (loading) return <LoadingIsland />;

  return (
    <div style="margin-top:90px; margin-inline:30px">
      <p class="alerts-info">Alerts are shown grouped by POD by latest one</p>
      <div class="notifications-container">
        <div class="notifications-header">
          {groupedAlerts.map((alert) => (
            <AlertComponent data={alert} clickable={true} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Alerts;
