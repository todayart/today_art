// components/DetailCard.jsx
import ArrowSvg from "assets/main/prevBtn.svg";
// import { useEffect } from "react";
import { ReactSVG } from "react-svg";

/**
 * 이미지와 상세 정보를 가로 레이아웃으로 보여주는 카드 컴포넌트입니다.
 *
 * needs 전체 크기: 1200×500px, 테두리만 그림
 * @param {{
 *   title: string;
 *   details: { label: string; value: string }[];
 *   imageUrl: string;
 * }} props
 * @param {string} props.title 카드 우측 상단 제목
 * @param {{ label: string; value: string }[]} props.details 좌측 110×20 영역과 우측 영역으로 나눌 상세 항목
 * @param {string} props.imageUrl 좌측 검은 박스 대신 들어갈 이미지 URL
 * @example
 * ```jsx
 * <DetailCard
 *   title="지역미술조명사업Ⅰ 《가고: 이동훈, 이남규, 이인영…》"
 *   imageUrl="https://example.com/art.jpg"
 *   details={[
 *     { label: "전시기간", value: "2024-03-19 ~ 2024-05-12" },
 *     { label: "부문",     value: "회화, 도예, 조각, 아카이브 등" },
 *     { label: "출품작가", value: "이동훈, 이남규, 이인영, 임봉재, 이종수" },
 *     { label: "전시장소", value: "1전시실,2전시실,3전시실,4전시실" },
 *   ]}
 *   handleGoBack={handleGoBack} // 뒤로가기 버튼 클릭 시 이전 페이지로 이동
 * />
 * ```
 */
export default function DetailCard({
  title,
  details = [{ label: "", value: "" }],
  imageUrl,
  handleGoBack = () => {},
}) {
  // useEffect(() => {
  //   console.log("DetailCard mounted");
  //   console.log("DetailCard mounted with title:", title);
  //   console.log("DetailCard details:", details);
  // }, [title, details]);

  return (
    <div className="detailCard flexCenter">
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
      {/* TODO : 이전 페이지로 이동하는 기능을 추가해야함 */}
      <button
        className="backButton flexCenter commonBorder"
        onClick={handleGoBack}
      >
        이전으로
      </button>
      {/* 지도 버튼 */}
      {/* TODO : 외부 지도 api 페이지로 이동하는 기능을 추가해야함 */}
      {/* TODO : 모바일 일땐, 다른 모습의 컴포넌트로 나와야함 */}

      <button className="mapBtn">
        MAP
        <ReactSVG
          src={ArrowSvg}
          style={{
            right: "44%",
            bottom: "-14px",
            position: "absolute",
            width: "14px",
            height: "44px",
            rotate: "-90deg",
          }}
        />
      </button>
    </div>
  );
}
