import TitleLogo from "assets/main/title_logo_bk.png";
import TitleLogoWhite from "assets/main/title_logo_wh.png";
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
    navigate(`/`);
  };

  return (
    <h1
      onClick={onLogoClick}
      className={wrapperClassName}
      style={{ cursor: "pointer", ...style }}
    >
      {/* TODO : 조건문 혹은 커스텀 훅을 통해 LocalStorage에 있는 theme가 "dark"로 시작되면 src를 TitleLogoWhite로 변경 */}
      <img
        src={TitleLogo}
        alt="TodayArt 홈페이지의 로고입니다."
        className={className}
      />
    </h1>
  );
}
