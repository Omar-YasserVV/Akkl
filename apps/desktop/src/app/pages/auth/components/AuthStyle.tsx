import { AkklLogin, AkklLoginBackground } from "../../../../assets";

function AuthStyle() {
  return (
    <div
      className="w-1/2 bg-cover z-[-555] bg-right bg-primary"
      style={{
        backgroundImage: `url(${AkklLoginBackground})`,
      }}
    >
      <img src={AkklLogin} className="absolute bottom-0 right-0 h-[83%] " />
    </div>
  );
}

export default AuthStyle;
