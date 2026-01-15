import { forwardRef } from "react";
import { ReactSVG } from "react-svg";

/**
 * SVG 아이콘을 포함한 버튼 컴포넌트
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.icon - 표시할 SVG 아이콘의 경로
 * @param {string} props.label - 접근성을 위한 스크린 리더용 레이블 텍스트
 * @param {Function} [props.onClick=() => {}] - 버튼 클릭 시 실행될 콜백 함수
 * @param {string} [props.className=""] - 추가적으로 적용할 CSS 클래스명
 * @param {boolean} [props.disabled=false] - 버튼 비활성화 여부
 * @param {Object} rest - 버튼 요소에 전달될 추가 HTML 속성들
 * @param {React.Ref} ref - 버튼 요소에 대한 ref
 * @returns {JSX.Element} SVG 아이콘이 포함된 버튼 컴포넌트
 *
 * @example
 * <SvgButton
 *   icon="/icons/menu.svg"
 *   label="메뉴 열기"
 *   onClick={handleMenuClick}
 * />
 */
const SvgButton = forwardRef(
  (
    {
      icon,
      label,
      onClick = () => {},
      className = "",
      disabled = false,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`iconButton ${className}`}
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        <span className="a11yHidden">{label}</span>
        <ReactSVG src={icon} className="reactSVGBox" />
      </button>
    );
  }
);

// 데브툴을 위한 displayName 설정
SvgButton.displayName = "SvgButton";

export default SvgButton;
