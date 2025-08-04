import { ReactSVG } from "react-svg";
import SelectIcon from "../../assets/common/selectIcon.svg";

/**
 * 전시장소를 선택하는 드롭다운 컴포넌트입니다.
 *
 * 주의: 이 컴포넌트는 고정된 크기(303×34px)와 flex-shrink 유지가 필요합니다.
 *
 * @param {Object} props - 컴포넌트의 props 객체
 * @param {string} [props.labelContents=""] - 드롭다운에 표시할 라벨 텍스트
 * @param {string[]} props.labels - 드롭다운에 표시할 전시장소 목록
 * @param {string} props.selected - 현재 선택된 값
 * @param {string} props.id - select 요소의 id 값
 * @param {Object} [props.selectStyle] - select 태그에 적용할 인라인 스타일 객체
 *
 * @example
 * <CommonSelect
 *   labelContents="전시장소"
 *   labels={["전체", "서울", "부산", "대구"]}
 *   selected="서울"
 *   id="exhibitionSelect"
 *   selectStyle={{ width: "220px", height: "34px"}}
 * />
 */

const CommonSelect = ({
  labelContents = "",
  labels,
  selected,
  id,
  selectStyle = "",
  onChange = () => {}, // 선택 변경 핸들러, 기본값은 빈 함수
}) => {
  return (
    <div className="selectWrapper">
      <label htmlFor={id}>{labelContents}</label>
      <select
        id={id}
        className="commonSelect commonBorder"
        value={selected}
        style={selectStyle}
        onChange={(e) => onChange && onChange(e.target.value)}
      >
        {labels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
      <ReactSVG src={SelectIcon} className="selectIconWrapper" />
    </div>
  );
};

export default CommonSelect;
