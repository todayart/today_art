import { ReactSVG } from "react-svg";
import FeedbackMessage from "components/common/FeedbackMessage";

/**
 * 아이콘과 텍스트를 세로로 배치한 피드백 메시지
 *
 * @param {Object} props
 * @param {string} props.icon - 표시할 SVG 경로
 * @param {string} props.message - 표시할 텍스트
 * @param {"status" | "alert"} [props.role="status"] - 접근성 role
 * @param {string} [props.containerClassName] - 루트 컨테이너 추가 클래스
 * @param {string} [props.iconClassName] - 아이콘 추가 클래스
 * @param {string} [props.textClassName] - 텍스트 추가 클래스
 */
export default function IconFeedback({
  icon,
  message,
  role = "status",
  containerClassName = "",
  iconClassName = "",
  textClassName = "",
}) {
  const contentClass = `iconFeedback ${containerClassName}`.trim();
  const iconClass = `iconFeedbackIcon ${iconClassName}`.trim();
  const textClass = `iconFeedbackText ${textClassName}`.trim();

  return (
    <FeedbackMessage role={role}>
      <div className={contentClass}>
        <ReactSVG src={icon} className={iconClass} />
        <span className={textClass}>{message}</span>
      </div>
    </FeedbackMessage>
  );
}
