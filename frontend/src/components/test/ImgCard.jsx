import React from "react";

// href 매개변수를 함수 시그니처에 추가하여 함수 본문에 포함시킵니다.
/**
 * 이미지 카드 컴포넌트입니다.
 * @param {string} listCover - 이미지 URL
 * @param {string} [href="#"] - 링크 URL (기본값: "#")
 * @returns {JSX.Element} 이미지 카드 컴포넌트 JSX 요소
 *
 * @example
 * // 이미지 카드 컴포넌트 사용 예시
 * <ImgCard
 *   listCover="https://example.com/image.jpg"
 *   href="https://example.com"
 * />
 */
export default function ImgCard({ listCover, href = "#" }) {
  return (
    <li>
      <a href="href">
        <div className="imgBox">
          {/* 이미지 아니면 백그라운드로 넣기 */}
          <img src={listCover} alt="" />
        </div>
        <div className="detailBox">
          <ul>
            {/* titleName */}
            <li className="titleName itemTitleFont">
              <p>유키 구라모토 콘서트(제목)유키 구라모토 콘서트(제목)</p>
            </li>
            {/* /titleName */}
            {/* place */}
            <li className="place itemPlaceFont">
              <p>서울시 예술의전당 (장소)서울시 예술의전당 (장소)</p>
            </li>
            {/* /place */}
            {/* data */}
            <li>
              <p className="itemDateFont">2024.04.01 ~ 2024.10.30</p>
            </li>
            {/* /data */}
          </ul>
        </div>
      </a>
    </li>
  );
}
