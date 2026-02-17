import { PageProps } from "fresh";
import CheckScanIsland from "../../../islands/CheckScanIsland.tsx";

const Home = ({url}:PageProps) => {
    const scanID = url.searchParams.get("scanID");
    return <CheckScanIsland uuid={scanID} />;
}

export default Home