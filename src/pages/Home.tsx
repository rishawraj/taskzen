import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import TaskLIstControl from "../components/TaskLIstControl";

export default function Home() {
  return (
    <>
      <div className="flex flex-col md:flex-row bg-background justify-start h-full min-h-screen">
        <div className="md:w-1/3 md:max-w-sm sticky top-0 h-full">
          <NavBar />
        </div>

        <div className="md:w-2/3 bg-pink-300 flex-grow">
          <TaskLIstControl />
        </div>
      </div>
    </>
  );
}
