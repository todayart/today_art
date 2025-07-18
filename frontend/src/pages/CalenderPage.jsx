import CalenderFixedCell from "components/calender/CalenderFixedCell";
import CalenderHeader from "components/calender/CalenderHeader";
import "styles/main/main.css";

/**
 * 이 컴포넌트는 calender 페이지의 메인 컴포넌트입니다.
 *
 * * Api에 필요한 id 규칙
 *  1m-start, 1m-end, 2m-start, 2m-end ... 12m-start, 12m-end로 설정되어 있음
 */
export default function CalenderPage() {
  // useEffect나 커스텀훅으로 내용을 작성

  return (
    <>
      {/* 캘린더 헤더 영역 */}
      <CalenderHeader />
      {/* 메인 캘린더 영역 (grid layout으로 13열 x 2행) */}
      <CalenderFixedCell>
        {/* TODO : 동적으로 쉘을 추가하도록 구현해봐야한다. */}
        {/* api를 활용해 동적 쉘과 전시이름이 적힌 컴포넌트가 생성된다. */}

        {/* 반복문 설명 : 2열부터 13열: 각 월에 대한 그리드 셀, 배열에 index만 필요하니 _를 사용해서 map을 활용함*/}
        {Array.from({ length: 12 }).map((_, monthIndex) =>
          Array.from({ length: 2 }).map((_, rowIndex) => (
            <div
              className="calenderCell"
              key={`${monthIndex}-${rowIndex}`}
              style={{
                gridColumn: monthIndex + 2,
                gridRow: rowIndex + 1,
              }}
              id={`${monthIndex + 1}m-${rowIndex === 0 ? "start" : "end"}`}
            >
              {/* 2) exhibitions[cellId]가 있으면, 그 문자열을 ExhibitionTag 컴포넌트로 감싼다 */}
              {/* {exhibitions[cellId] && (
                <ExhibitionTag name={exhibitions[cellId]} />
              )} */}
            </div>
          ))
        )}
      </CalenderFixedCell>
    </>
  );
}
