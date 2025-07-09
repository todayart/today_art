import TitleLogo from "../../assets/main/title_logo_bk.png";

export default function Logoimg({ className = "" }) {
  return (
    <img
      src={TitleLogo}
      alt="TodayArt 홈페이지의 로고입니다."
      className={className}
    />
  );
}
