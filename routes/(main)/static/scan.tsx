import { ErrorBoxVisible2 } from "../../../signals.ts";
import StaticForm from "../../../components/StaticFrom.tsx"

const StaticScan = ({ url }: any) => {
  const error = url.searchParams.get("error");
  if(error!==null){
    ErrorBoxVisible2.value = true;
  }
  return <StaticForm error={error} />;
};

export default StaticScan;
