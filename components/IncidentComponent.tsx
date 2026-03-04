type IncidentProps = {
  data: {
    _id?: string;
    id: string;
    pod: string;
    namespace: string;
    severity: string;
    alertCount: number;
    status: "open" | "quarantined" | "deleted";
  };
  clickable: boolean;
  showDeleteButton?: boolean;
  onDeleteIncident?: (data: {
    _id?: string;
    id: string;
    pod: string;
    namespace: string;
  }) => void;
};

const IncidentComponent = (
  {
    data,
    clickable = true,
    showDeleteButton = true,
    onDeleteIncident,
  }: IncidentProps,
) => {
  const b64id = btoa(data.pod);

  return (
    <div class="notification-item details-card">
      <h3 class="details-title">{data.id}</h3>
      <div class="details-grid">
        <p class="detail-item">
          <span class="detail-label-inline">Pod:</span>
          <span class="detail-value-inline">{data.pod}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Namespace:</span>
          <span class="detail-value-inline">{data.namespace}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Severity:</span>
          <span class="detail-value-inline">{data.severity}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Alert Count:</span>
          <span class="detail-value-inline">{data.alertCount}</span>
        </p>
        <p class="detail-item">
          <span class="detail-label-inline">Status:</span>
          <span class="detail-value-inline">{data.status}</span>
        </p>
      </div>

      {clickable && (
        <div class="card-actions-row">
          <a class="action-btn quarantine-btn" href={`/incident/${b64id}`}>
            View Incident
          </a>
          <a class="action-btn view-pod-btn" href={`/pod/${b64id}`}>
            Go To Pod
          </a>
          {showDeleteButton && (
            <button
              class="action-btn delete-pod-btn"
              onClick={() =>
                onDeleteIncident?.({
                  _id: data._id,
                  id: data.id,
                  pod: data.pod,
                  namespace: data.namespace,
                })}
            >
              Delete Incident
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default IncidentComponent;
