import ChartIsland from "../islands/ChartIsland.tsx";
import NotificationIsland from "../islands/NotificationIsland.tsx";
import StatsIsland from "../islands/StatsIslands.tsx";
    
const Dashboard = () => {
  return (
    <div class="dashboard">
      <StatsIsland  />
      <ChartIsland  />
      <NotificationIsland  />
    </div>
  );
};

export default Dashboard;