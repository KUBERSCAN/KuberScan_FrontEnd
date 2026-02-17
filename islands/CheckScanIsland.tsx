import CheckScan from "../components/CheckScan.tsx";

type CheckScanForm = {
  uuid: string | null;
};

const CheckScanIsland = ({uuid}:CheckScanForm) => {
    return <CheckScan uuid={uuid} />;
}

export default CheckScanIsland