// src/components/common/Tooltip.jsx

/**
 * 자식 요소들을 툴팁 컨테이너로 감싸는 툴팁 컴포넌트입니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 툴팁 내부에 표시될 콘텐츠
 * @param {string} [props.className] - 추가 적용할 클래스 이름
 * @returns {JSX.Element} 자식 요소들을 포함하는 툴팁 스타일의 div 요소
 */

export default function Tooltip({ children, className = "" }) {
  const merged = `tooltip ${className}`.trim();
  return <div className={merged}>{children}</div>;
}
