import ImgCard from "./ImgCard";

/**
 * CategoryList 컴포넌트는 이미지 카드 목록을 렌더링합니다.
 *
 * @param {Array} entries
 * @param {Function} handleImgCardClick
 * @returns {JSX.Element}
 */

export default function CategoryList({ handleImgCardClick, entries = [] }) {
  const list = Array.isArray(entries) ? entries : [];

  return (
    <div className="listBox">
      <ul className="listTrack">
        {list.map((entry, index) => (
          <ImgCard
            key={entry?.ID ?? index}
            title={entry?.TITLE}
            address={entry?.HOST_INST_NM}
            sPeriod={entry?.BEGIN_DE}
            ePeriod={entry?.END_DE}
            imageUrl={entry?.IMAGE_URL}
            onClick={() => handleImgCardClick(entry?.TITLE)}
          />
        ))}
      </ul>
    </div>
  );
}
