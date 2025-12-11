/**
 * 접근 가능한 커스텀 셀렉트 컴포넌트
 * 네이티브 <select> 요소를 대체하며, 완전한 키보드 접근성을 제공
 *
 * 해당 컴포넌트만 있어도 작동하도록 설계되었으며, 스타일링은 CSS 클래스명을 통해 조정 가능
 *
 * @description
 * 키보드 내비게이션:
 * - 위/아래 화살표: 옵션 이동
 * - Enter/Space: 드롭다운 열기/닫기 및 옵션 선택
 * - Escape/Tab: 드롭다운 닫기
 * - 마우스 호버: 옵션 활성화
 *
 * @param {string} value - 현재 선택된 옵션의 값
 * @param {function(string): void} onChange - 선택된 값이 변경될 때 호출되는 콜백 함수
 * @param {Array<{value: string|number, label: string, disabled?: boolean}>} options - 선택 가능한 옵션들의 배열
 * @param {string} [placeholder="선택하세요"] - 아무것도 선택되지 않았을 때 표시될 플레이스홀더 텍스트
 * @param {boolean} [disabled=false] - 컴포넌트 비활성화 여부
 * @param {boolean} [error=false] - 에러 상태 여부 (에러 스타일 적용)
 * @param {string} [width] - 컴포넌트의 너비 (CSS 값)
 * @param {string} [className=""] - 추가할 CSS 클래스명
 *
 * @returns {JSX.Element} CustomSelect 컴포넌트
 *
 * @example
 * ```jsx
 * const options = [
 *   { label: "사과", value: "apple" },
 *   { label: "바나나", value: "banana" },
 *   { label: "체리", value: "cherry", disabled: true },
 * ];
 *
 * function Example() {
 *   const [val, setVal] = useState("");
 *   return (
 *     <CustomSelect
 *       value={val}
 *       onChange={setVal}
 *       options={options}
 *       placeholder="과일을 선택하세요"
 *       width="240px"
 *       error={val === ""}
 *     />
 *   );
 * }
 * ```
 */
// 접근 가능한 커스텀 셀렉트 컴포넌트 (네이티브 <select> 대체)
// 키보드: 위/아래 화살표로 이동, Enter/Space로 열기/선택, Escape나 Tab으로 닫기

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { ReactSVG } from "react-svg";
import SelectIcon from "assets/common/selectIcon.svg";
import { useResetSubscription } from "stores/resetStore";

function normalizeOptions(options) {
  if (!Array.isArray(options)) return [];
  return options.map((opt, idx) => ({
    value: opt?.value ?? String(idx),
    label: opt?.label ?? String(opt?.value ?? idx),
    disabled: Boolean(opt?.disabled),
  }));
}

/*
사용 예시

const options = [
  { label: "사과", value: "apple" },
  { label: "바나나", value: "banana" },
  { label: "체리", value: "cherry", disabled: true },
];

function Example() {
  const [val, setVal] = useState("");
  return (
    <CustomSelect
      value={val}
      onChange={setVal}
      options={options}
      placeholder="과일을 선택하세요"
      width="240px"
      error={val === ""}
    />
  );
}
*/

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "선택하세요",
  disabled = false,
  error = false,
  width,
  className = "",
}) {
  const listboxId = useId();
  const buttonId = useMemo(() => `${listboxId}-button`, [listboxId]);
  const normalized = useMemo(() => normalizeOptions(options), [options]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);
  const containerRef = useRef(null);

  const selectedIndex = useMemo(
    () => normalized.findIndex((opt) => opt.value === value),
    [normalized, value]
  );
  const selectedOption = selectedIndex >= 0 ? normalized[selectedIndex] : null;

  const mergedClass = [
    "customSelect",
    "selectWrapper",
    "commonBorder",
    // 상태 class는 -- 접두사 사용
    open ? "customSelect--open" : "",
    disabled ? "customSelect--disabled" : "",
    error ? "customSelect--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const closeList = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleOptionSelect = (index) => {
    const opt = normalized[index];
    if (!opt || opt.disabled) return;
    if (opt.value !== value) onChange?.(opt.value);
    closeList();
  };

  // 외부 클릭/블러 시 닫기
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        closeList();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // 선택되었거나 첫 번째 활성화된 인덱스로 설정
  useEffect(() => {
    if (!open) return;
    const firstEnabled = normalized.findIndex((opt) => !opt.disabled) ?? -1;
    const nextIndex = selectedIndex >= 0 ? selectedIndex : firstEnabled;
    setActiveIndex(nextIndex);

    // listbox 키보드 포커스 이동
    const listEl = listRef.current;
    if (listEl) {
      requestAnimationFrame(() => {
        listEl.focus();
      });
    }
  }, [open, normalized, selectedIndex]);

  const moveActive = (delta) => {
    if (!normalized.length) return;
    let idx = activeIndex;
    const len = normalized.length;
    for (let i = 0; i < len; i += 1) {
      idx = (idx + delta + len) % len;
      if (!normalized[idx]?.disabled) {
        setActiveIndex(idx);
        break;
      }
    }
  };

  const handleButtonKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        moveActive(e.key === "ArrowDown" ? 1 : -1);
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        closeList();
      }
    }
  };

  const handleListKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOptionSelect(activeIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeList();
    } else if (e.key === "Tab") {
      closeList();
    }
  };

  const widthStyle = width ? { width } : undefined;

  // 리셋 구독: 드롭다운 닫기 및 활성 하이라이트 제거
  const handleReset = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);
  useResetSubscription(handleReset);

  return (
    <div className={mergedClass} ref={containerRef} style={widthStyle}>
      <button
        id={buttonId}
        type="button"
        className="customSelect__button commonTitleText commonSelect"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={handleToggle}
        onKeyDown={handleButtonKeyDown}
        disabled={disabled}
      >
        <span className="customSelect__label ">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span aria-hidden className="customSelect__chevron">
          <ReactSVG src={SelectIcon} className="selectIconWrapper" />
        </span>
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          tabIndex={-1}
          className="customSelect__list"
          ref={listRef}
          onKeyDown={handleListKeyDown}
        >
          {normalized.map((opt, idx) => {
            const isSelected = idx === selectedIndex;
            const isActive = idx === activeIndex;
            const optionClass = [
              "customSelect__option",
              isSelected ? "is-selected" : "",
              isActive ? "is-active" : "",
              opt.disabled ? "is-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <li
                id={`${listboxId}-option-${idx}`}
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled || undefined}
                className={optionClass}
                onClick={() => handleOptionSelect(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
