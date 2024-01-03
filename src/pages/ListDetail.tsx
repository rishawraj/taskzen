import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import TaskLIstControl from "../components/TaskLIstControl";

function ListDetail() {
  const { listName } = useParams();

  return (
    <>
      <NavBar />
      <h1 className="font-bold text-text bg-background">{listName}</h1>
      <TaskLIstControl listName={listName} />
    </>
  );
}

export default ListDetail;
