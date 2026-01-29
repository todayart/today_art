import { useNavigate } from "react-router-dom";

import TitleLogo from "assets/main/title_logo_bk.png";
import TitleLogoWhite from "assets/main/title_logo_wh.png";

export default function Logoimg({
  className = "",
  wrapperClassName = "",
  style = {},
  isDark = false,
}) {
  // Router 내비게이터
  const navigate = useNavigate();
  // 로고 클릭 시
  const onLogoClick = () => {
    navigate(`/`);
  };

  return (
    <h1
      onClick={onLogoClick}
      className={wrapperClassName}
      style={{ cursor: "pointer", ...style }}
    >
      <img
        src={isDark ? TitleLogoWhite : TitleLogo}
        alt="TodayArt 홈페이지의 로고입니다."
        className={className}
      />
    </h1>
  );
}
