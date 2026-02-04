import { useEffect, useState } from "preact/hooks";
import AlertComponent from "./AlertComponent.tsx";

type Alert = {
  output: string,
  containerid : string,
  containername: string,
  podname: string,
  namespace: string,
  username: string,
  useruid: string,
  priority: string,
  rule: string,
  time: string,
  source: string,
  tags: string[]
}


const fetchAlerts = async () => {
    const response = await fetch('https://dynamicalerts.sergioom9.deno.net/');
    const data = await response.json();
    return data;
}


function Alerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        const fetchAndSetAlerts = async () => {
            const alerts = await fetchAlerts();
            setAlerts(alerts);
        };
        fetchAndSetAlerts();
    }, []);

  return (
    <div>
        <h5>Total Alerts {alerts.length}</h5>
        {alerts.map((alert) => (
            <AlertComponent data={alert} />
        ))}
    </div>
  );
}
export default Alerts;