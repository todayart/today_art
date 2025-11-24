// src/components/mobile/MobileDetailCard.jsx
export default function MobileDetailCard({
  title,
  details = [{ label: "", value: "" }],
  imageUrl,
}) {
  return (
    <div className="mobileDetailCard flexCenter">
      {/* 이미지와 콘텐츠 사이 간격 74px */}
      <div className="detailCardContent">
        {/* 좌측 이미지 카드 */}
        <img src={imageUrl} alt={title} />

        {/* 우측 콘텐츠: 제목과 리스트 */}
        <div className="detailCardText">
          {/* 제목과 리스트 사이 31px */}
          <h2>{title}</h2>

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
