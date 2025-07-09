import { useState } from "react";
import DatePicker from "react-datepicker";

/**
 * 시작 날짜와 종료 날짜를 각각 선택하여
 * 부모로 전달하는 테스트용 컴포넌트입니다.
 *
 * @param {{ onRangeChange: ({ startDate: Date|null, endDate: Date|null }) => void }} props
 * @param {Function} props.onRangeChange - 날짜 변경 시 { startDate, endDate } 형태로 호출
 * @example
 * ```jsx
 * function App() {
 *   const handleRange = ({ startDate, endDate }) => {
 *     console.log("선택된 시작:", startDate);
 *     console.log("선택된 종료:", endDate);
 *   };
 *
 *   return <TestDateRangePicker onRangeChange={handleRange} />;
 * }
 * ```
 */
const TestDateRangePicker = ({ onRangeChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartChange = (date) => {
    setStartDate(date);
    onRangeChange({ startDate: date, endDate });
  };

  const handleEndChange = (date) => {
    setEndDate(date);
    onRangeChange({ startDate, endDate: date });
  };

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <DatePicker
        selected={startDate}
        onChange={handleStartChange}
        placeholderText="시작 날짜 선택"
        dateFormat="yyyy-MM-dd"
        className="period-input" /* 필요 시 스타일링 클래스 추가 */
      />
      <DatePicker
        selected={endDate}
        onChange={handleEndChange}
        placeholderText="종료 날짜 선택"
        dateFormat="yyyy-MM-dd"
        minDate={startDate}
        className="period-input"
      />
    </div>
  );
};

export default TestDateRangePicker;
