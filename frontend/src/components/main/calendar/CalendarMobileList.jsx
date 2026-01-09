import ExhibitionTag from "components/main/calendar/ExhibitionTag";
import { format } from "date-fns";

const months = Array.from({ length: 12 }, (_, idx) => ({
  month: idx + 1,
  label: format(new Date(2000, idx, 1), "MMMM"),
}));

export default function CalendarMobileList({ exhibitions = {} }) {
  return (
    <section className="calendarMobileList" aria-label="월별 전시 일정">
      {months.map(({ month, label }) => {
        const openKey = `${month}m-start`;
        const closeKey = `${month}m-end`;
        const openList = exhibitions[openKey] || [];
        const closeList = exhibitions[closeKey] || [];

        return (
          // 각 월별 카드

          // TODO-1-2 : 부모의 상태에 따라 translateX 조절 필요 (2월이면 오른쪽으로 100vw 만큼, 3월이면 200vw 만큼)
          <article key={month} className="calendarMobileCard">
            {/* upperSection */}
            <div className="calendarMobileSection">
              <div className="calendarMobileSectionTitle">OPEN</div>
              <div className="calendarMobileTags">
                {openList.length ? (
                  openList.map((name, idx) => (
                    <ExhibitionTag key={`open-${month}-${idx}`} name={name} />
                  ))
                ) : (
                  <p className="calendarMobileEmpty">
                    예정된 개막 정보가 없습니다.
                  </p>
                )}
              </div>
            </div>
            {/* lowerSection */}
            <div className="calendarMobileSection">
              <div className="calendarMobileSectionTitle">CLOSE</div>
              <div className="calendarMobileTags">
                {closeList.length ? (
                  closeList.map((name, idx) => (
                    <ExhibitionTag key={`close-${month}-${idx}`} name={name} />
                  ))
                ) : (
                  <p className="calendarMobileEmpty">
                    예정된 종료 정보가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
