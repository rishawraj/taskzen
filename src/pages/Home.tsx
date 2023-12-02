import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl bg-red-400 text-green-400">Taskzen</h1>
      <Link to="/login"> Login</Link>
    </>
  );
}
