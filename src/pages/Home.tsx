import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import TaskLIstControl from "../components/TaskLIstControl";

export default function Home() {
  return (
    <>
      <div className="flex flex-col md:flex-row bg-green-500 justify-start">
        <div className="md:w-1/3 md:max-w-md">
          <NavBar />
        </div>

        <div className="md:w-2/3 bg-pink-300 flex-grow">
          <TaskLIstControl />
        </div>
      </div>
    </>
  );
}
