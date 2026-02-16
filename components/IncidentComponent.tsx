
type IncidentProps = {
    data:{
    id: string,
    pod: string,
    namespace: string,
    firstSeen: string,
    lastSeen: string,
    severity: string,
    alertCount: number,
    status: "open" | "quarantined" | "deleted"
    }
    ,clickable:boolean
}

const IncidentComponent = ({data,clickable=true}:IncidentProps) => {
    const b64id=btoa(data.pod)
    if(!clickable){
        return (
            <div class="notification-item">
            <h3>{data.id}</h3>
            <p><span style="color:red">Pod: </span></p><p>{data.pod}</p>
            <p><span style="color:red">Namespace: </span></p><p>{data.namespace}</p>
            <p><span style="color:red">First Seen: </span></p><p>{data.firstSeen}</p>
            <p><span style="color:red">Last Seen: </span></p><p>{data.lastSeen}</p>
            <p><span style="color:red">Severity: </span></p><p>{data.severity}</p>
            <p><span style="color:red">Alert Count: </span></p><p>{data.alertCount}</p>
            <p><span style="color:red">Status: </span></p><p>{data.status}</p>
            </div>
    );
    }
    return (
            <a href={`/incident/${b64id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div class="notification-item">
            <h3>{data.id}</h3>
            <p><span style="color:red">Pod: </span></p><p>{data.pod}</p>
            <p><span style="color:red">Namespace: </span></p><p>{data.namespace}</p>
            <p><span style="color:red">First Seen: </span></p><p>{data.firstSeen}</p>
            <p><span style="color:red">Last Seen: </span></p><p>{data.lastSeen}</p>
            <p><span style="color:red">Severity: </span></p><p>{data.severity}</p>
            <p><span style="color:red">Alert Count: </span></p><p>{data.alertCount}</p>
            <p><span style="color:red">Status: </span></p><p>{data.status}</p>
            </div>
            </a>
    );
}
export default IncidentComponent;