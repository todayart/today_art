import { useState } from "react";
import DatePicker from "react-datepicker";
import { ReactSVG } from "react-svg";
import CalendarIcon from "assets/common/calendar.svg";
import { format } from "date-fns";

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
 *   return <PeriodInput onRangeChange={handleRange} />;
 * }
 * ```
 */

const PeriodInput = ({ onRangeChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartChange = (date) => {
    setStartDate(date);
    // console.log("startDate data type:", typeof date, date); // object
    // console.log("formated startDate:", typeof format(date, "yyyy-MM-dd")); // string
    const payload = {
      startDate: date ? format(date, "yyyy-MM-dd") : null,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
    };
    onRangeChange(payload);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
    const payload = {
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
      endDate: date ? format(date, "yyyy-MM-dd") : null,
    };
    onRangeChange(payload);
  };

  return (
    <div className="periodInputWrapper ">
      <span className="commonTitleText">기간지정</span>
      {/* 시작일 선택 */}
      <div className="datePickerBox">
        <DatePicker
          selected={startDate}
          onChange={handleStartChange}
          placeholderText="시작 날짜"
          dateFormat="yyyy-MM-dd"
          wrapperClassName="datepickerInputWrapper"
          className="periodInput"
        />
        <ReactSVG src={CalendarIcon} className="calendarIcon" />
      </div>

      {/* 구분선 */}
      <span>–</span>

      {/* 종료일 선택 */}
      <div className="datePickerBox">
        <DatePicker
          selected={endDate}
          onChange={handleEndChange}
          placeholderText="종료 날짜"
          dateFormat="yyyy-MM-dd"
          minDate={startDate}
          wrapperClassName="datepickerInputWrapper"
          className="periodInput "
        />
        <ReactSVG src={CalendarIcon} className="calendarIcon" />
      </div>
    </div>
  );
};

export default PeriodInput;
