import Logoimg from "../main/Logoimg";
import Header from "./Header";

export default function CommonHeader({ children }) {
  return (
    <div className="commonHeader">
      <Header />
      <div className="selectBox flexCenter">
        <Logoimg className="commonHeaderLogoImg" />
        {children}
      </div>
    </div>
  );
}
