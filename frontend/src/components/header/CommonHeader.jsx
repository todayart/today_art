import Logoimg from "components/main/Logoimg";
import Header from "./Header";

export default function CommonHeader({
  children,
  selectBoxClassName = "",
  className = "",
  selectBoxId = "",
}) {
  return (
    <div className={`commonHeader ${className}`}>
      <Header />
      <Logoimg
        className="commonHeaderLogoImg"
        wrapperClassName="commonHeaderLogoHeading"
      />
      <div
        id={selectBoxId || undefined}
        className={`selectBox flexCenter ${selectBoxClassName}`}
      >
        <div className="selectScroller">{children}</div>
      </div>
    </div>
  );
}
