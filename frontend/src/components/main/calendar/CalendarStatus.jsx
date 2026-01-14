// src/components/main/calendar/CalendarStatus.jsx
// 캘린더 상태 표시 컴포넌트 (로딩 및 에러 상태)

export default function CalendarStatus({ loading, error, onRetry }) {
  if (!loading && !error) return null;

  return (
    <div className="calendarStatus" role="status" aria-live="polite">
      {loading && <span>불러오는 중...</span>}
      {!loading && error && (
        <>
          <span>일정을 불러오지 못했습니다.</span>
          {onRetry && (
            <button
              type="button"
              className="calendarStatusButton"
              onClick={onRetry}
            >
              다시 시도
            </button>
          )}
        </>
      )}
    </div>
  );
}
