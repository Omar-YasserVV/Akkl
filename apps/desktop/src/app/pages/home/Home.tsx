import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Akkl Desktop App!
        </h1>
        <Link to="/login">Go to About</Link>
      </div>
    </>
  );
}

export default Home;
