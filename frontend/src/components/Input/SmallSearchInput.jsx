import { useCallback, useEffect, useState } from "react";
import CommonSearchIcon from "assets/common/commonSearch.svg";
import SvgButton from "components/common/SvgButton";
import { useResetSubscription } from "stores/resetStore";

/**
 * 검색 입력창과 버튼이 결합된 컴포넌트입니다.
 * needs 고정된 크기(359×34px), 가운데 정렬, Enter 및 아이콘 클릭 시 onSearch 호출
 *
 * @param {object} props
 * @param {string} props.value            - 입력된 검색어 값
 * @param {(value: string)=>void} props.onChange  - 입력값 변경 시 호출
 * @param {()=>void} props.onSearch       - 검색 실행 시 호출
 * @param {string} [props.placeholder]    - 입력창 placeholder (기본: "검색어를 입력하세요")
 *
 * @example
 * ```jsx
 * <SearchBox
 *   value={query}
 *   onChange={setQuery}
 *   onSearch={() => console.log("검색!", query)}
 *   placeholder="제품명을 입력하세요"
 * />
 * ```
 */
const SmallSearchInput = ({
  value,
  onChange = () => {},
  onSearch,
  placeholder = "",
}) => {
  const [innerValue, setInnerValue] = useState(value || "");

  // 외부 value 변화에 따라 로컬 상태 동기화
  useEffect(() => {
    setInnerValue(value || "");
  }, [value]);

  const handleInputChange = useCallback(
    (next) => {
      setInnerValue(next);
      onChange(next);
    },
    [onChange]
  );

  const handleReset = useCallback(() => {
    setInnerValue("");
    onChange("");
    if (onSearch) {
      onSearch();
    }
  }, [onChange]);

  useResetSubscription(handleReset);

  return (
    <div className="smallSearchWrapper">
      {/* 라벨링 + 텍스트 */}
      <label htmlFor="smallSearchInput" className="commonTitleText">
        검색
      </label>

      {/* 입력창 */}
      <input
        id="smallSearchInput"
        className="smallSearchInput"
        type="text"
        value={innerValue}
        // TODO : 입력값 변경 핸들러 추가, 디바운스 구현할 때 완성
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />

      {/* 검색 버튼 */}
      <SvgButton
        icon={CommonSearchIcon}
        ariaLabel="검색"
        onClick={onSearch}
        className="smallSearchButton"
      />
    </div>
  );
};

export default SmallSearchInput;
