
type IncidentProps = {
    id: string,
    pod: string,
    namespace: string,
    firstSeen: string,
    lastSeen: string,
    severity: string,
    alertCount: number,
    status: "open" | "quarantined" | "resolved"
}

const IncidentComponent = (data: IncidentProps) => {
    return (
        <div>
            <h3>{data.id}</h3>
            <p>Pod: {data.pod}</p>
            <p>Namespace: {data.namespace}</p>
            <p>First Seen: {data.firstSeen}</p>
            <p>Last Seen: {data.lastSeen}</p>
            <p>Severity: {data.severity}</p>
            <p>Alert Count: {data.alertCount}</p>
            <p>Status: {data.status}</p>
        </div>
    );
}
export default IncidentComponent;