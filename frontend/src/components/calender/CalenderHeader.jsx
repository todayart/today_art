import React from "react";
import Header from "components/calender/CalenderHeader";
import Logoimg from "components/main/Logoimg";
import { format } from "date-fns";

export default function CalenderHeader() {
  return (
    <section className="commonHeader">
      <Header />
      <div className="selectBox">
        {/* 로고 파트 */}
        <div className="calenderLogo">
          <Logoimg className="calenderLogoImg" />
          <span className="currentYear">{format(new Date(), "yyyy")}</span>
        </div>
        {/* 월 표시 그리드 파트 */}
        <section className="monthGrid">
          {[...Array(13)].map((_, index) => {
            // 첫 쉘은 비움
            if (index === 0) {
              return <div key={index} className="monthCell"></div>;
            }
            const monthDate = new Date(2000, index - 1, 1);
            const monthName = format(monthDate, "MMMM");
            return (
              <div key={index} className="monthCell">
                <span>{monthName}</span>
                <span>{index < 10 ? "0" + index : index}</span>
              </div>
            );
          })}
        </section>
      </div>
    </section>
  );
}
