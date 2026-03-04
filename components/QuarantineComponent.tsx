import { deletedPods, quarantinedPods } from "../signals.ts";

type QuarantineProps = {
  data: {
    pod?: string;
    podname?: string;
    namespace: string;
  };
  clickable: boolean;
};

const dequarantinePod = async (podname: string, namespace: string) => {
  const dequarantine = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/pod/quarantine",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pod: podname,
        namespace,
      }),
    },
  );
  if (dequarantine.ok) {
    quarantinedPods.value = Math.max(0, quarantinedPods.value - 1);
    return "success";
  }
  return "failure";
};

const deletePod = async (podname: string, namespace: string) => {
  const deletePod = await fetch(
    "https://dynamicalerts.sergioom9.deno.net/pod/delete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pod: podname,
        namespace,
      }),
    },
  );
  if (deletePod.ok) {
    deletedPods.value += 1;
    return "success";
  }
  return "failure";
};

const QuarantineComponent = ({ data, clickable = true }: QuarantineProps) => {
  const podname = data.pod ?? data.podname ?? "";
  const b64id = btoa(podname);

  if (!clickable) {
    return (
      <div class="notification-item">
        <p>
          <span style="color:red">Pod Name:</span>
          {podname}
        </p>
        <p>
          <span style="color:red">Namespace:</span>
          {data.namespace}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dequarantinePod(podname, data.namespace);
          }}
          class="action-btn delete-pod-btn"
        >
          ✅ Dequarantine Pod
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deletePod(podname, data.namespace);
          }}
          class="action-btn delete-pod-btn"
        >
          🗑️ Delete Pod
        </button>
      </div>
    );
  }

  return (
    <a
      href={`/pod/${b64id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div class="notification-item">
        <p>
          <span style="color:red">Pod Name:</span>
          {podname}
        </p>
        <p>
          <span style="color:red">Namespace:</span>
          {data.namespace}
        </p>
      </div>
    </a>
  );
};

export default QuarantineComponent;
