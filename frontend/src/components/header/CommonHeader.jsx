import Logoimg from "components/main/Logoimg";
import Header from "./Header";

export default function CommonHeader({
  children,
  selectBoxClassName = "",
  className = "",
  selectBoxId = "",
  isDetail = false,
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
        <div className={`selectScroller ${isDetail ? "isDetailPage" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
