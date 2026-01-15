// src/components/mobile/MobileDetailCard.jsx
import { useRef, useState } from "react";
import Tooltip from "components/common/Tooltip";

export default function MobileDetailCard({
  title,
  details = [{ label: "", value: "" }],
  imageUrl,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const pressTimerRef = useRef(null);

  const handlePressStart = () => {
    if (pressTimerRef.current) return;
    pressTimerRef.current = setTimeout(() => {
      setShowTooltip(true);
      pressTimerRef.current = null;
    }, 600);
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setShowTooltip(false);
  };

  return (
    <div className="mobileDetailCard flexCenter">
      {/* 이미지와 콘텐츠 사이 간격 74px */}
      <div className="detailCardContent">
        {/* 좌측 이미지 카드 */}
        <img src={imageUrl} alt={title} />

        {/* 우측 콘텐츠: 제목과 리스트 */}
        <div className="detailCardText">
          {/* 제목과 리스트 사이 31px */}
          <div
            className="longPressTarget"
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onTouchMove={handlePressEnd}
            onTouchCancel={handlePressEnd}
          >
            <h2>{title}</h2>
            {showTooltip && (
              <Tooltip className="longPressTooltip">{title}</Tooltip>
            )}
          </div>

          <ul>
            {details
              .filter(({ value }) => value !== null && value !== "")
              .map(({ label, value }) => (
                <li key={label}>
                  {/* 왼쪽 칸 110×20, 우측 border 1px */}
                  <span>{label}</span>
                  <span>{value}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
