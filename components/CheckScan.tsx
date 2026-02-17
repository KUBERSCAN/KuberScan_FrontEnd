import { useState } from "preact/hooks";

type CheckScanForm = {
  uuid: string | null;
};
export type ScanData = {
  ScanID: string;
  image: string;
  Vulnerability: Vulnerability[];
  status: string;
};

export type Vulnerability = {
  VulnerabilityID: string;
  PkgName: string;
  PkgID: string;
  FixedVersion: string;
  PrimaryURL: string;
  Title: string;
  Description: string;
  CweIDs: string[];
  _id: string;
};

const CheckScan = ({ uuid }: CheckScanForm) => {
  const effectiveuuid = uuid ?? "";
  const [scanID, setScanID] = useState<string>(effectiveuuid);
  const [result, setResult] = useState<ScanData | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const resultdata = await fetch("/api/static/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scanID }),
    });
    const data = await resultdata.json();
    setResult(data.data);
    console.log(result);
  };

  return (
    <>
      <section class="main">
        <h1>
          <span>CHECK RESULTS</span>
        </h1>

        <form class="login-form" onSubmit={handleSubmit}>
          <h3 style="text-align: center; margin-bottom: 30px; font-size: 28px; font-weight: 700; color: #FFFFFF;">
            Check for Scan Results
          </h3>

          <label for="scanID"></label>
          <input
            type="text"
            id="scanID"
            name="scanID"
            placeholder="beae6f15-3b16-4fea-a944-2121351500bd"
            value={scanID}
            onInput={(e) => setScanID((e.target as HTMLInputElement).value)}
            required
          />
          <button type="submit" class="login-btn">Check Scan</button>
        </form>

        {result && result.Vulnerability?.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "100%",
            }}
          >
            {result.Vulnerability.map((vuln: any, index: number) => (
              <div
                key={index}
                class="alert-card"
                style={{
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "2px solid rgba(239, 68, 68, 0.3)",
                  padding: "18px",
                  borderRadius: "10px",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                  🚨 {vuln.VulnerabilityID}
                </div>

                <div style={{ marginTop: "6px" }}>
                  <b>Package:</b> {vuln.PkgName}
                </div>

                <div>
                  <b>Version:</b> {vuln.PkgID}
                </div>

                <div>
                  <b>Fixed:</b> {vuln.FixedVersion}
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "#cbd5f5",
                  }}
                >
                  {vuln.Description}
                </div>

                <a
                  href={vuln.PrimaryURL}
                  target="_blank"
                  style={{
                    marginTop: "10px",
                    display: "inline-block",
                    color: "#60a5fa",
                    fontWeight: "bold",
                  }}
                >
                  View CVE →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default CheckScan;
