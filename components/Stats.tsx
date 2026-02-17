import { useEffect, useState } from "preact/hooks";
import { deletedPods, quarantinedPods } from "../signals.ts";
import LoadingIsland from "../islands/LoadingIsland.tsx";
type Stats = {
  Connected_Users: string;
  Incidents: string;
  Alerts: string;
  Quarantined: string;
  Deleted: string;
};

const fetchdata = async () => {
  const alerts = await fetchAlerts();
  const incidents = await fetchIncidents();
  const quarantined = await fetchQuarantined();
  const alertnumber = alerts.length;
  const incidentnumber = incidents.length;
  quarantinedPods.value = quarantined.length
  return {
    user: {
      email: "admin@example.com",
      name: "Admin",
    },
    stats: {
      Connected_Users: 1,
      Incidents: incidentnumber,
      Alerts: alertnumber,
      Quarantined: quarantined.length,
      Deleted: deletedPods.value,
    },
    alerts,
    incidents,
  };
};

const fetchAlerts = async () => {
  const response = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/data/alerts",
  );
  const data = await response.json();
  return data;
};
const fetchIncidents = async () => {
  const response = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/data/incidents",
  );
  const data = await response.json();
  return data;
};
const fetchQuarantined = async () =>{
  const response = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/data/quarantined",
  );
  const data = await response.json();
  return data;
}

const Stats = () => {
  const [stats, setStats] = useState<Stats>();
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchandsetStats = async () => {
      setLoading(true)
      const data = await fetchdata();
      setStats({
        Connected_Users: "1",
        Incidents: data.stats.Incidents,
        Alerts: data.stats.Alerts,
        Quarantined: quarantinedPods.value.toString(),
        Deleted: deletedPods.value.toString(),
      });
    };
    fetchandsetStats();
    setLoading(false)
  }, []);
  if (loading) {
    return <LoadingIsland />;
  }
  if (!stats) {
    return (
      <div class="stats-grid">
        <div class="stat-card">
          No stats
        </div>
      </div>
    );
  }
  return (
    <div class="stats-grid">
      <a href="/incidents" style={{ textDecoration: "none", color: "inherit" }}>
        <div class="stat-card">
          <h3>Incidents</h3>
          <p class="stat-value">{stats.Incidents}</p>
        </div>
      </a>
      <a href="/alerts" style={{ textDecoration: "none", color: "inherit" }}>
        <div class="stat-card">
          <h3>Alerts</h3>
          <p class="stat-value">{stats.Alerts}</p>
        </div>
      </a>
      <a href="/quarantine" style={{ textDecoration: "none", color: "inherit" }}>
      <div class="stat-card">
        <h3>Quarantined</h3>
        <p class="stat-value">{stats.Quarantined}</p>
      </div>
      </a>
      <div class="stat-card">
        <h3>Deleted</h3>
        <p class="stat-value">{stats.Deleted}</p>
      </div>
    </div>
  );
};

export default Stats;
