import TitleLogo from "assets/main/title_logo_bk.png";

export default function Logoimg({ className = "" }) {
  return (
    <h1>
      <img
        src={TitleLogo}
        alt="TodayArt 홈페이지의 로고입니다."
        className={className}
      />
    </h1>
  );
}
