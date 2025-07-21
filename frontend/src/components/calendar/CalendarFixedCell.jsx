import CalendarCell from "components/calendar/CalendarCell";
import ExhibitionTag from "components/calendar/ExhibitionTag";

export default function CalendarFixedCell({ exhibitions }) {
  // TODO : exhibitions 데이터를 받아서 각 셀에 전시 이름을 표시하도록 구현
  // 예시로 빈 객체를 사용하고 있습니다. 실제로는 API에서 데이터를 받아
  // exhibitions 객체는 { "1m-start": "전시1", "1m-end": "전시2", ... } 형태로 되어 있어야 합니다.
  // 각 키에 해당하는 값은 전시 이름입니다.
  // 예시: exhibitions = { "1m-start": "전시1", "1m-end": "전시2", ... }
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
      {/* TODO : 동적으로 쉘을 추가하도록 구현해봐야한다. */}
      {/* api를 활용해 동적 쉘과 전시이름이 적힌 컴포넌트가 생성된다. */}

      {/* 반복문 설명 : 2열부터 13열: 각 월에 대한 그리드 셀, 배열에 index만 필요하니 _를 사용해서 map을 활용함*/}
      {Array.from({ length: 12 }).map((_, monthIndex) =>
        Array.from({ length: 2 }).map((_, rowIndex) => {
          const id = `${monthIndex + 1}m-${rowIndex === 0 ? "start" : "end"}`;
          return (
            <CalendarCell
              key={id}
              monthIndex={monthIndex}
              rowIndex={rowIndex}
              tag={exhibitions[id] && <ExhibitionTag name={exhibitions[id]} />}
            />
          );
        })
      )}
    </main>
  );
}
