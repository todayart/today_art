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

          // TODO-1 : 트리거(CalendarHeader의 모바일 분기의 svg 버튼)가 눌리면 calendarMobileCard에 overflowHidden 옵션이 있고, 부모인 List는 세로로 되어 있다. 추후 monthCell 내부에 좌우 버튼을 추가할 예정이며, 각 버튼을 누르면 monthCell은 좌측 또는 우측으로 100vw씩 이동하고, section.calendarMobileList는 상하로 calc(100vh - var(--commonHeader-height))만큼 이동하는 기능을 추가해야함.

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
