import CalendarCell from "components/main/calendar/CalendarCell";
import ExhibitionTag from "components/main/calendar/ExhibitionTag";

export default function CalendarFixedCell({
  exhibitions,
  onHoverMonth,
  onLeaveMonth,
}) {
  return (
    <main className="calendarWrapper">
      {/* 첫 번째 열: 고정 파트 (OPEN, CLOSE) */}
      {["OPEN", "CLOSE"].map((label, idx) => (
        <div
          key={idx}
          className="calendarCell"
          style={{
            gridColumn: 1,
            gridRow: idx + 1,
          }}
        >
          {label}
        </div>
      ))}
      {/* TODO : 해당 CalenarCell이 클릭되면 .innerCell:hover가 발생함 이를 트리거로, id를 추적하여 open인지 close인지, 몇 월인지 배경 색을 바꾸는 옵션을 추가하면 ux가 상승할 것 같다. */}
      {/* 반복문 설명 : 2열부터 13열: 각 월에 대한 그리드 셀, 배열에 index만 필요하니 _를 사용해서 map을 활용함*/}
      {Array.from({ length: 12 }).map((_, monthIndex) =>
        Array.from({ length: 2 }).map((_, rowIndex) => {
          const id = `${monthIndex + 1}m-${rowIndex === 0 ? "start" : "end"}`;
          return (
            <CalendarCell
              key={id}
              monthIndex={monthIndex}
              rowIndex={rowIndex}
              onHoverMonth={onHoverMonth}
              onLeaveMonth={onLeaveMonth}
            >
              {/* exhibitions 객체에서 해당 월의 전시 이름을 가져와서 ExhibitionTag 컴포넌트로 렌더링 */}
              {/* id가 key와 같다면 value를 name으로 전달하면 된다. */}
              {/* { "1m-start": ["전시1", ... ], "1m-end": ["전시2", ...] } */}
              {exhibitions[id] &&
                exhibitions[id].map((exhibition, index) => (
                  <ExhibitionTag key={index} name={exhibition} />
                ))}
            </CalendarCell>
          );
        })
      )}
    </main>
  );
}
