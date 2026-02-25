import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="flex flex-col h-screen w-screen items-center justify-center gap-5 bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Akkl Desktop App!
        </h1>
        <Button
          as={Link}
          to="/sign-in"
          className="bg-secondary font-semibold rounded-lg px-3 text-white py-3"
        >
          Go to Sign in
        </Button>
      </div>
    </>
  );
}

export default Home;
