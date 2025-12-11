import { useCallback, useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import SelectIcon from "assets/common/selectIcon.svg";
import { useResetSubscription } from "stores/resetStore";

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

/**
 * CommonSelect - 공통 셀렉트 컴포넌트
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.labelContents=""] - 셀렉트 박스의 라벨 텍스트
 * @param {Array<string>} props.labels - 셀렉트 옵션으로 사용될 문자열 배열
 * @param {string} props.selected - 현재 선택된 값
 * @param {string} props.id - 셀렉트 요소의 고유 ID
 * @param {Function} [props.onChange=()=>{}] - 셀렉트 값 변경 시 호출되는 핸들러 함수
 * - select의 onChange: 사용자가 옵션을 선택하면 e.target.value를 통해 선택된 값을 전달받아 부모 컴포넌트의 상태를 업데이트
 * - 리셋 기능: useResetSubscription을 통해 외부에서 리셋 이벤트가 발생하면 labels 배열의 첫 번째 값으로 자동 설정
 *
 * @returns {JSX.Element} 라벨, 셀렉트 박스, 아이콘이 포함된 셀렉트 컴포넌트
 *
 * @example
 * <CommonSelect
 *   labelContents="카테고리 선택"
 *   labels={["전체", "회화", "조각", "사진"]}
 *   selected={selectedCategory}
 *   id="categorySelect"
 *   onChange={handleCategoryChange}
 * />
 */
const CommonSelect = ({
  labelContents = "",
  labels,
  selected,
  id,
  onChange = () => {}, // 선택 변경 핸들러, 기본값은 빈 함수
}) => {
  const initial = Array.isArray(labels) && labels.length > 0 ? labels[0] : "";
  const [selectedValue, setSelectedValue] = useState(selected || initial);

  // 외부 props 변화에 따라 로컬 상태 동기화
  useEffect(() => {
    setSelectedValue(selected || initial);
  }, [selected, initial]);

  const handleChange = useCallback(
    (nextVal) => {
      setSelectedValue(nextVal);
      onChange(nextVal);
    },
    [onChange]
  );

  // useCallback을 사용하여 labels와 onChange가 변경될 때만 함수를 재생성하도록 최적화
  // useResetSubscription에 전달되는 함수의 불필요한 재생성을 방지함
  const handleReset = useCallback(() => {
    setSelectedValue(initial);
    onChange(initial);
  }, [initial, onChange]);

  useResetSubscription(handleReset);

  return (
    <div className="selectWrapper">
      <label htmlFor={id} className="commonTitleText">
        {labelContents}
      </label>
      <select
        id={id}
        className="commonSelect commonBorder"
        value={selectedValue}
        onChange={(e) => handleChange(e.target.value)}
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
