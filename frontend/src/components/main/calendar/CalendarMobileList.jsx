import ExhibitionTag from "components/main/calendar/ExhibitionTag";

export default function CalendarMobileList({
  exhibitions = {},
  selectedMonth = 1,
  monthsArray = null,
}) {
  const offset = (selectedMonth - 1) * 100;
  return (
    <section
      className="calendarMobileList"
      aria-label="월별 전시 일정"
      style={{ transform: `translateX(-${offset}vw)` }}
    >
      {monthsArray.map(({ month }) => {
        const openKey = `${month}m-start`;
        const closeKey = `${month}m-end`;
        const openList = exhibitions[openKey] || [];
        const closeList = exhibitions[closeKey] || [];

        return (
          // 각 월별 카드

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
