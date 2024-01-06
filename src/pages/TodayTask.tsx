import NavBar from "../components/NavBar";
import TaskLIstControl from "../components/TaskLIstControl";

function TodayTask() {
  const date = new Date();
  return (
    <>
      <div className="flex flex-col md:flex-row bg-background justify-start h-full min-h-screen">
        <div className="md:w-1/3 md:max-w-sm">
          <NavBar />
        </div>

        <div className="md:w-2/3 bg-pink-300 flex-grow">
          <h1 className="text-4xl">Today, {date.getDate()}</h1>
          <TaskLIstControl taskDate="TODAY" />
        </div>
      </div>
    </>
  );
}

export default TodayTask;
