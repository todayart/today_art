import React from "react";

export default function CategorieTag() {
  // TODO : METADATA 파일을 따로 분리하면 편하다.
  // 폴더 이름은 METADATA로 해도 좋고 검색해도 좋다.
  const metaData = [
    "카테고리1",
    "카테고리2",
    "카테고리3",
    "카테고리4",
    "카테고리5",
    "카테고리6",
  ];

  return (
    <ul>
      {metaData.map((data, index) => {
        return <li key={index}>{data}</li>;
      })}
    </ul>
  );
}
