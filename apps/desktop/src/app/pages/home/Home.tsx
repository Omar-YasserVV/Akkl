import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="flex flex-col h-screen w-screen items-center justify-center gap-5 bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Akkl Desktop App!
        </h1>
        <div className="flex gap-3">
          <Link
            to="/sign-in"
            className="bg-primary font-semibold rounded-lg px-3 text-white py-3"
          >
            Go to Sign in
          </Link>
          <Link
            to="/sign-up"
            className="bg-primary font-semibold rounded-lg px-3 text-white py-3"
          >
            Go to Sign up
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
