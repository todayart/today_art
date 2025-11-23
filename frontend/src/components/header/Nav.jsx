import { ReactSVG } from "react-svg";
import urlMeta from "contents/urlMeta.json";
import useMobile from "hooks/useMobile";

const icons = {
  HomeSvg: require("../../assets/common/home.svg").default,
  CalendarSvg: require("../../assets/common/calendar.svg").default,
  UserSvg: require("../../assets/common/user.svg").default,
  WishSvg: require("../../assets/common/wish.svg").default,
  QuestionSvg: require("../../assets/common/question.svg").default,
};

const hamburgerIcon =
  require("../../assets/common/mobile/hamburger.svg").default;

export default function Nav() {
  const isMobile = useMobile();

  return (
    <nav>
      <ul className="navBox">
        {isMobile ? (
          // 모바일 뷰포트인 경우 햄버거 버튼 렌더링
          <li>
            <button type="button" className="hamburgerBtn">
              <ReactSVG src={hamburgerIcon} />
            </button>
          </li>
        ) : (
          // 기존 네비게이션 링크 렌더링
          urlMeta.navLinks.map((link) => {
            const svgSrc = icons[link.icon];
            return (
              <li key={link.name}>
                <a href={link.url}>{svgSrc && <ReactSVG src={svgSrc} />}</a>
              </li>
            );
          })
        )}
      </ul>
    </nav>
  );
}
