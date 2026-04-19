import { AkklLogin, AkklLoginBackground } from "@/assets";

function AuthStyle() {
  return (
    <div
      className="relative flex items-center w-1/2 min-h-screen bg-primary max-lg:hidden overflow-hidden"
      style={{
        backgroundImage: `url(${AkklLoginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "right",
      }}
    >
      <img
        src={AkklLogin}
        className="absolute 
          w-auto object-contain"
        alt="Login illustration"
      />
    </div>
  );
}

export default AuthStyle;
