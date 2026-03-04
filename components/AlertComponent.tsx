type AlertProps = {
  data: {
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
  clickable: boolean;
};

const AlertComponent = ({ data, clickable = true }: AlertProps) => {
  const b64id = btoa(data.podname);
  const CardContent = (
    <div class="notification-item details-card">
      <h3 class="details-title">{data.output}</h3>
      <div class="details-grid">
        <p class="detail-item">
          <span class="detail-label-inline">Container ID:</span>
          <span class="detail-value-inline">{data.containerid}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Container Name:</span>
          <span class="detail-value-inline">{data.containername}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Pod Name:</span>
          <span class="detail-value-inline">{data.podname}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Namespace:</span>
          <span class="detail-value-inline">{data.namespace}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Username:</span>
          <span class="detail-value-inline">{data.username}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">User UID:</span>
          <span class="detail-value-inline">{data.useruid}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Priority:</span>
          <span class="detail-value-inline">{data.priority}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Rule:</span>
          <span class="detail-value-inline">{data.rule}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Time:</span>
          <span class="detail-value-inline">{data.time}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Source:</span>
          <span class="detail-value-inline">{data.source}</span>
        </p>
      </div>
      <p class="detail-item details-tags">
        <span class="detail-label-inline">Tags:</span>
        <span class="detail-value-inline">{data.tags.join(" | ")}</span>
      </p>
    </div>
  );

  if (!clickable) {
    return CardContent;
  }

  return (
    <a
      href={`/pod/${b64id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {CardContent}
    </a>
  );
};

export default AlertComponent;
