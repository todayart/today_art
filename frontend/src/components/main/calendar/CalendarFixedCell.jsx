import CalendarCell from "components/main/calendar/CalendarCell";
import ExhibitionTag from "components/main/calendar/ExhibitionTag";

export default function CalendarFixedCell({ exhibitions }) {
  // TODO : exhibitions 데이터를 받아서 각 셀에 전시 이름을 표시하도록 구현
  // 예시로 빈 객체를 사용하고 있습니다. 실제로는 API에서 데이터를 받아
  // exhibitions 객체는 { "1m-start": ["전시1", ... ], "1m-end": ["전시2", ...] } 형태로 되어 있어야 합니다.
  // 각 키에 해당하는 값은 전시 이름입니다.
  // exhibitions 객체가 비어있으면 빈 셀을 렌더링합니다.

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
            <CalendarCell key={id} monthIndex={monthIndex} rowIndex={rowIndex}>
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
