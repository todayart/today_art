import { ReactSVG } from "react-svg";
import DetailIcon from "../../assets/main/detailIcon.svg";
/**
 *  *엔트리 페이지의 자세히보기 버튼입니다.
 */

export default function DetailBtn({ href = "#" }) {
  return (
    <div className="detailBtnOuterBox">
      <a href={href} className="detailBoxBtn">
        <div className="detailIcon">
          <ReactSVG
            src={DetailIcon}
            beforeInjection={(svg) => {
              svg.setAttribute("width", "44");
              svg.setAttribute("height", "44");
            }}
          />
        </div>
        <span>자세히보기</span>
      </a>
    </div>
  );
}
