import { ReactSVG } from "react-svg";
import imgcardDetailIcon from "assets/common/imgcardDetailIcon.svg";

/**
 * 이미지와 제목·주소·기간 정보를 담은 카드 컴포넌트입니다.
 * needs 전체 크기 width 232px, height 293px
 *
 * @param {{
 *   title: string;
 *   address: string;
 *   sPeriod: string;
 *   ePeriod: string;
 *   imageUrl?: string;
 * }} props
 * @param {string} props.title 카드 상단에 보일 제목
 * @param {string} props.address 주소 텍스트
 * @param {string} props.sPeriod 시작 기간
 * @param {string} props.ePeriod 종료 기간
 * @param {string} [props.imageUrl] 상단 검정 박스 대신 들어갈 이미지 URL
 * @example
 * ```jsx
 * <ImgCard
 *   title="아트페어 2025"
 *   address="서울시 강남구"
 *   sPeriod="2025-01-01"
 *   ePeriod="2025-12-31"
 *   imageUrl="https://example.com/art.jpg"
 *  onClick={() => console.log('Card clicked')}
 * />
 * ```
 */
const ImgCard = ({
  title,
  address,
  sPeriod,
  ePeriod,
  imageUrl,
  onClick = () => {},
}) => {
  return (
    <div className="imgCard">
      {imageUrl ? (
        // 이미지 영역: imageUrl이 있는 경우
        <div className="imgCardImage" onClick={onClick}>
          <img
            src={imageUrl}
            alt={`${title}의 포스트 사진입니다.`}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      ) : (
        // 이미지 영역: imageUrl이 없는 경우
        <div className="imgCardPlaceholder imgCardPlaceholderFont">
          포스트가 존재하지 않습니다.
        </div>
      )}
      <div className="imgCardContent">
        {/* 제목: 글자 수 초과 시 말줄임 */}
        <h3 className="imgCardTitle imgCardTitleFont textOverflow">{title}</h3>
        {/* 주소 */}
        <p className="imgCardAddress imgCardAddressFont textOverflow">
          {address}
        </p>
        {/* 기간 */}
        <p className="imgCardPeriod imgCardPeriodFont textOverflow">
          {sPeriod} ~ {ePeriod}
        </p>
        {/* 상세 버튼 아이콘 - 디자인 피드백, 비활성화 */}
        {/* <button className="imgCardDetailButton flexCenter" type="button">
          <ReactSVG src={imgcardDetailIcon} />
        </button> */}
      </div>
    </div>
  );
};

export default ImgCard;
