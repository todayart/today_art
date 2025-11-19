import TitleLogo from "assets/main/title_logo_bk.png";
import { useNavigate } from "react-router-dom";

export default function Logoimg({
  className = "",
  wrapperClassName = "",
  style = {},
}) {
  // Router 내비게이터
  const navigate = useNavigate();
  // 로고 클릭 시
  const onLogoClick = () => {
    navigate(`/list`);
  };

  return (
    <h1
      onClick={onLogoClick}
      className={wrapperClassName}
      style={{ cursor: "pointer", ...style }}
    >
      <img
        src={TitleLogo}
        alt="TodayArt 홈페이지의 로고입니다."
        className={className}
      />
    </h1>
  );
}
