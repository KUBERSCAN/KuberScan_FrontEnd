import { useEffect, useRef, useState } from "preact/hooks";
import { deletedPods, quarantinedPods } from "../signals.ts";

interface Data {
  Connected_Users: number;
  Incidents: number;
  Alerts: number;
  Quarantined: number;
  Deleted: number;
}

const fetchdata = async () => {
  const alerts = await fetchAlerts();
  const incidents = await fetchIncidents();
  const alertnumber = alerts.length;
  const incidentnumber = incidents.length;
  return {
    Connected_Users: 1,
    Incidents: incidentnumber,
    Alerts: alertnumber,
    Quarantined: quarantinedPods.value,
    Deleted: deletedPods.value,
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

function Chart() {
  const [data, setData] = useState<Data>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchAndSet = async () => {
    const response = await fetchdata();
    setData(response);
    }
    fetchAndSet();
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const chartData = [
      { label: "Jan", value: Math.max(1, data.Alerts * 0.1) },
      { label: "Feb", value: Math.max(1, data.Alerts * 0.2) },
      { label: "Mar", value: Math.max(1, data.Alerts * 0.2) },
      { label: "Apr", value: Math.max(1, data.Alerts * 0.3) },
      { label: "May", value: Math.max(1, data.Alerts * 0.4) },
      { label: "Jun", value: Math.max(1, data.Alerts * 0.5) },
      { label: "Jul", value: Math.max(1, data.Alerts * 0.6) },
      { label: "Aug", value: Math.max(1, data.Alerts * 0.7) },
      { label: "Sep", value: Math.max(1, data.Alerts * 0.8) },
      { label: "Oct", value: Math.max(1, data.Alerts * 0.9) },
      { label: "Nov", value: Math.max(1, data.Alerts) },
      { label: "Dec", value: Math.max(1, data.Alerts * 1.1) },
    ];

    const canvasWidth = canvas.width;
    const padding = 40;
    const usableWidth = canvasWidth - (padding * 2);
    const barWidth = usableWidth / chartData.length * 0.6;
    const barSpacing = usableWidth / chartData.length * 0.4;

    const maxValue = Math.max(...chartData.map((d) => d.value), 1);
    const chartHeight = 200;
    const startY = 250;

    chartData.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + barSpacing);
      const y = startY - barHeight;

      const gradient = ctx.createLinearGradient(x, y, x, startY);
      gradient.addColorStop(0, "#6C5CE7");
      gradient.addColorStop(1, "#4834DF");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = "#A0A0A0";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.label, x + barWidth / 2, startY + 20);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "14px bold sans-serif";
      ctx.fillText(
        item.value.toFixed(1),
        x + barWidth / 2,
        y - 10,
      
      );
    });
  }, [data]);



  return (
    <div class="chart-container">
      <h2 class="chart-title">Alert Growth</h2>
      <canvas
        ref={canvasRef}
        width="1200"
        height="300"
        style="width: 100%; height: auto; background: transparent;"
      />
    </div>
  );
}

export default Chart;
