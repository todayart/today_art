// utils/calendar.js
// 캘린더 관련 유틸 함수들

import { format } from "date-fns";

// 월 배열을 반환하는 함수
export const getMonths = () =>
  Array.from({ length: 12 }, (_, idx) => {
    const month = idx + 1;
    return { month, name: format(new Date(2000, idx, 1), "MMMM") };
  });

// 현재 월(1~12)을 반환하는 함수
export const getCurrentMonth = () => new Date().getMonth() + 1;

// 현재 년도를 반환하는 함수
export const getCurrentYear = () => format(new Date(), "yyyy");
