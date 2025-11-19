import Logoimg from "components/main/Logoimg";
import Header from "./Header";

export default function CommonHeader({ children }) {
  return (
    <div className="commonHeader">
      <Header />
      <Logoimg
        className="commonHeaderLogoImg"
        wrapperClassName="commonHeaderLogoHeading"
      />
      <div className="selectBox flexCenter">
        <div className="selectScroller">{children}</div>
      </div>
    </div>
  );
}
