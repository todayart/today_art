import ExhibitionTag from "components/main/calendar/ExhibitionTag";
import { useEffect, useState } from "react";

export default function CalendarMobileList({
  exhibitions = {},
  selectedMonth = 1,
  monthsArray = [],
}) {
  const [showHint, setShowHint] = useState(true);
  const offset = (selectedMonth - 1) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="calendarMobileListWrapper">
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
                      <ExhibitionTag
                        key={`close-${month}-${idx}`}
                        name={name}
                      />
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
      <p
        className={`calendarMobileHint flexCenter${
          showHint ? "" : " is-hidden"
        }`}
      >
        좌우로 넘겨서 월별 내용을 확인하세요
      </p>
    </div>
  );
}
