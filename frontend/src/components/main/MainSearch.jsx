import React from "react";
import { ReactSVG } from "react-svg";
// ReactSVG 사용하면 SVG파일을 불러와서 사용할 수 있음
import SearchSvg from "assets/main/search.svg";

export default function MainSearch({
  placeholder = "검색어를 입력하세요",
  value = "",
  onSearch = () => {},
  onChange = () => {},
}) {
  return (
    <div className="searchGroup">
      {/* searchGroupInner */}
      <div className="searchGroupInner">
        {/* searchInput */}
        <label htmlFor="mainSearchInput" className="a11yHidden">
          메인 엔트리 페이지, 전시회 검색 입력창
        </label>
        <input
          id="mainSearchInput"
          className="searchInput"
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(value)}
        />

        {/* search button */}
        <button
          type="button"
          className="searchButton"
          aria-label="메인 검색 버튼"
          onClick={onSearch()}
        >
          <ReactSVG src={SearchSvg} />
        </button>
      </div>
    </div>
  );
}
