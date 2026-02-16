import { useEffect, useState } from "preact/hooks";
import LoadingIsland from "../islands/LoadingIsland.tsx";
import QuarantineComponent from "./QuarantineComponent.tsx";

type Quarantine = {
  podname: string,
  namespace: string,
}


const fetchQuarantined= async () => {
    const response = await fetch('https://dynamicalerts.sergioom9.deno.net/data/quarantined');
    const data = await response.json();
    return data;
}


function Quarantine() {
    const [quarantined, setQuarantined] = useState<Quarantine[]>([]);
    const [loading,setLoading] = useState(true)
    useEffect(() => {
      setLoading(true)
        const fetchAndSetQuarantined = async () => {
            const quarantined = await fetchQuarantined();
            setQuarantined(quarantined);
        };
        fetchAndSetQuarantined();
        setLoading(false)
    }, []);

if(loading){return <LoadingIsland />}
  return (
    <div style="margin-top:90px; margin-inline:30px">
      <p class="alerts-info">Quarantined Pods</p>
        <div class="notifications-container" >
        <div class="notifications-header">
        {quarantined.map((elem) => (
            <QuarantineComponent data={elem} clickable={true} />
        ))}
        </div>
        </div>
    </div>
  );
}
export default Quarantine;