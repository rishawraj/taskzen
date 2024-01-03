import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import TaskLIstControl from "../components/TaskLIstControl";

export default function Home() {
  return (
    <>
      <div className="h-full min-h-screen w-full flex flex-col md:flex-row md:justify-between bg-background text-text p-3">
        <div className="lg:w-2/6">
          <NavBar />
        </div>

        <div className="lg:w-full md:w-2/3 xl:2/6">
          <TaskLIstControl />
        </div>

        <div className="hidden xl:flex bg-accent w-4/6"></div>
      </div>
    </>
  );
}
