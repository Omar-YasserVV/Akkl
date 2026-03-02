import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="flex flex-col h-screen w-screen items-center justify-center gap-5">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Akkl Desktop App!
        </h1>
        <div className="flex gap-5 items-center">
          <Button
            as={Link}
            to="/sign-in"
            className="bg-primary font-semibold rounded-lg px-3 text-white py-3"
          >
            Go to Sign in
          </Button>
          <Button
            as={Link}
            to="/dashboard"
            className="bg-primary font-semibold rounded-lg px-3 text-white py-3"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </>
  );
}

export default Home;
