import Logoimg from "components/main/Logoimg";
import Header from "./Header";

export default function CommonHeader({
  children,
  selectBoxClassName = "",
  className = "",
}) {
  return (
    <div className={`commonHeader ${className}`}>
      <Header />
      <Logoimg
        className="commonHeaderLogoImg"
        wrapperClassName="commonHeaderLogoHeading"
      />
      <div className={`selectBox flexCenter ${selectBoxClassName}`}>
        <div className="selectScroller">{children}</div>
      </div>
    </div>
  );
}
