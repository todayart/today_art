import { ReactSVG } from "react-svg";
import imgcardDetailIcon from "../../assets/common/imgcardDetailIcon.svg";

/**
 * 이미지와 제목·주소·기간 정보를 담은 카드 컴포넌트입니다.
 * needs 전체 크기 width 232px, height 293px
 *
 * @param {{
 *   title: string;
 *   address: string;
 *   period: string;
 *   imageUrl?: string;
 * }} props
 * @param {string} props.title 카드 상단에 보일 제목
 * @param {string} props.address 주소 텍스트
 * @param {string} props.period 기간 텍스트
 * @param {string} [props.imageUrl] 상단 검정 박스 대신 들어갈 이미지 URL
 * @example
 * ```jsx
 * <ImgCard
 *   title="아트페어 2025"
 *   address="서울시 강남구"
 *   period="2025-07-01 ~ 2025-07-12"
 *   imageUrl="https://example.com/art.jpg"
 * />
 * ```
 */
const ImgCard = ({ title, address, period, imageUrl }) => {
  return (
    <div className="imgCard">
      {imageUrl ? (
        // 이미지 영역: imageUrl이 있는 경우
        <div className="imgCardImage">
          <img
            src={imageUrl}
            alt={`${title}의 포스트 사진입니다.`}
            style={{ width: "100%", height: "100%", display: "block" }}
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
        <p className="imgCardPeriod imgCardPeriodFont textOverflow">{period}</p>

        {/* 상세 버튼 아이콘 */}
        {/* TODO 버튼 누를 때 일어날 이벤트를 추가해야함 */}
        <button className="imgCardDetailButton flexCenter" type="button">
          <ReactSVG src={imgcardDetailIcon} />
        </button>
      </div>
    </div>
  );
};

export default ImgCard;
