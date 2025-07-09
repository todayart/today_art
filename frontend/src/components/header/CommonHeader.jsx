import Logoimg from "../main/Logoimg";
import Header from "./Header";

export default function CommonHeader({ children }) {
  return (
    <div className="commonHeader testLine">
      <Header />
      <div className="selectBox flexCenter testLine">
        <Logoimg className={"commonHeaderLogoImg"} />
        {children}
      </div>
    </div>
  );
}
