// frontend/src/utils/util.js

// 값을 문자열로 보장하는 유틸 함수
export const isItString = (value) => {
  // console.log("isItString called with:", value);
  // console.log("Type of value:", typeof value);
  return typeof value === "string" ? value : String(value ?? "");
};
