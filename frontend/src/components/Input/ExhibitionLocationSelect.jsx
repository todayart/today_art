import { ReactSVG } from "react-svg";
import PlaceSelectIcon from "../../assets/common/placeSelectIcon.svg";
/**
 * 전시장소를 선택하는 드롭다운 컴포넌트입니다.
 * needs 고정된 크기(303×34px)와 flex-shrink 유지가 필요합니다.
 *
 * @param {{ labels: string[], selected: string, onChange: (value: string) => void }} props
 * @param {string[]} props.labels 드롭다운에 표시할 전시장소 목록
 * @param {string} props.selected 현재 선택된 값
 * @param {(value: string) => void} props.onChange 선택이 변경될 때 호출되는 콜백
 *
 * @example
 * ```jsx
 * <ExhibitionLocationSelect
 *   labels={["전체", "서울", "부산", "대구"]}
 *   selected={location}
 *   onChange={(value) => setLocation(value)}
 * />
 * ```
 */

const ExhibitionLocationSelect = ({ labels, selected = "전체" }) => {
  return (
    <div className="exhibitionSelectWrapper">
      <label htmlFor="exhibitionLocationSelect">전시장소</label>
      <select
        id="exhibitionLocationSelect"
        className="exhibitionLocationSelect"
        value={selected}
        // TODO : 전시 장소 onChange 핸들러 추가
        // onChange={(e) => onChange(e.target.value)}
      >
        {labels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
      <ReactSVG src={PlaceSelectIcon} className="selectIconWrapper" />
    </div>
  );
};

export default ExhibitionLocationSelect;
