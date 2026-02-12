
type AlertProps = {
    data: {
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
    },
    clickable:boolean
}

const AlertComponent = ({data,clickable=true}:AlertProps) => {
    const b64id=btoa(data.podname)
    if(!clickable){
        return(
           <div class="notification-item">
            <h3>{data.output}</h3>
            <p><span style="color:red">Container ID:</span></p><p>{data.containerid}</p>
            <p><span style="color:red">Container Name:</span> {data.containername}</p>
            <p><span style="color:red">Pod Name: </span>{data.podname}</p>
            <p><span style="color:red">Namespace: </span>{data.namespace}</p>
            <p><span style="color:red">Username:</span> {data.username}</p>
            <p><span style="color:red">User UID:</span> {data.useruid}</p>
            <p><span style="color:red">Priority: </span>{data.priority}</p>
            <p><span style="color:red">Rule: </span>{data.rule}</p>
            <p><span style="color:red">Time: </span>{data.time}</p>
            <p><span style="color:red">Source: </span>{data.source}</p>
            <p><span style="color:red">Tags: </span>{data.tags.join(" | ")}</p>
        </div> 
        )
    }
    return (
        <a href={`/pod/${b64id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div class="notification-item">
            <h3>{data.output}</h3>
            <p><span style="color:red">Container ID:</span></p><p>{data.containerid}</p>
            <p><span style="color:red">Container Name:</span> {data.containername}</p>
            <p><span style="color:red">Pod Name: </span>{data.podname}</p>
            <p><span style="color:red">Namespace: </span>{data.namespace}</p>
            <p><span style="color:red">Username:</span> {data.username}</p>
            <p><span style="color:red">User UID:</span> {data.useruid}</p>
            <p><span style="color:red">Priority: </span>{data.priority}</p>
            <p><span style="color:red">Rule: </span>{data.rule}</p>
            <p><span style="color:red">Time: </span>{data.time}</p>
            <p><span style="color:red">Source: </span>{data.source}</p>
            <p><span style="color:red">Tags: </span>{data.tags.join(" | ")}</p>
        </div>
        </a>
    );
}
export default AlertComponent;