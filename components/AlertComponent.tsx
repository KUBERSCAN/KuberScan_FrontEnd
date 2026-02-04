
type AlertProps = {
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

const AlertComponent = (data: AlertProps) => {
    return (
        <div>
            <h3>{data.output}</h3>
            <p>Container ID: {data.containerid}</p>
            <p>Container Name: {data.containername}</p>
            <p>Pod Name: {data.podname}</p>
            <p>Namespace: {data.namespace}</p>
            <p>Username: {data.username}</p>
            <p>User UID: {data.useruid}</p>
            <p>Priority: {data.priority}</p>
            <p>Rule: {data.rule}</p>
            <p>Time: {data.time}</p>
            <p>Source: {data.source}</p>
            <p>Tags: {data.tags.join(" | ")}</p>
        </div>
    );
}
export default AlertComponent;