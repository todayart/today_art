import { ReactSVG } from "react-svg";

/**
 * SVG 아이콘과 함께 사용하는 버튼 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.icon - 표시할 SVG 아이콘의 경로
 * @param {string} props.label - 접근성을 위한 버튼 레이블 (화면 리더용)
 * @param {string} [props.ariaLabel=""] - 접근성을 위한 aria-label 속성
 * @param {Function} props.onClick - 버튼 클릭 시 실행될 함수
 * @param {string} [props.className=""] - 추가할 CSS 클래스명
 * @param {boolean} [props.disabled=false] - 버튼 비활성화 여부
 * @returns {JSX.Element} SVG 버튼 컴포넌트
 */

const SvgButton = ({
  icon,
  label,
  onClick = () => {},
  className = "",
  disabled = false,
  ariaLabel = "",
}) => {
  return (
    <button
      aria-label={ariaLabel}
      className={`iconButton ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="a11yHidden">{label}</span>
      <ReactSVG src={icon} className="reactSVGBox" />
    </button>
  );
};

export default SvgButton;
