import React from "react";

import { format } from "date-fns";

import Logoimg from "components/main/Logoimg";
import Header from "components/header/Header";
import SvgButton from "components/common/SvgButton";

import useMobile from "hooks/useMobile";

import calendarArrow from "assets/common/mobile/calendarArrow.svg";

export default function CalendarHeader({ activeMonth = null }) {
  const isMobile = useMobile();

  return (
    <section className="commonHeader">
      <Header />
      <div className="selectBox">
        {/* 로고 파트 */}
        <div className="calendarLogo">
          <Logoimg className="calendarLogoImg" />
          <span className="currentYear">{format(new Date(), "yyyy")}</span>
        </div>
        {/* 월 표시 그리드 파트 */}
        {isMobile ? (
          <section className="monthGrid">
            {[...Array(13)].map((_, index) => {
              // 첫 쉘은 비움
              if (index === 0) {
                return <div key={index} className="monthCell"></div>;
              }
              const monthDate = new Date(2000, index - 1, 1);
              const monthName = format(monthDate, "MMMM");
              const isActive = activeMonth === index;
              return (
                // 월 표시
                <div
                  key={index}
                  className={`monthCell${isActive ? " is-active" : ""}`}
                >
                  <SvgButton icon={calendarArrow} className="monthNavButton" />
                  <div className="monthTitle">
                    <span className="monthName">{monthName}</span>
                    <span className="monthNumber">
                      {index < 10 ? "0" + index : index}
                    </span>
                  </div>
                  <SvgButton
                    icon={calendarArrow}
                    className="monthNavButton reverse"
                  />
                </div>
              );
            })}
          </section>
        ) : (
          <section className="monthGrid">
            {[...Array(13)].map((_, index) => {
              // 첫 쉘은 비움
              if (index === 0) {
                return <div key={index} className="monthCell"></div>;
              }
              const monthDate = new Date(2000, index - 1, 1);
              const monthName = format(monthDate, "MMMM");
              const isActive = activeMonth === index;

              return (
                // 월 표시
                <div
                  key={index}
                  className={`monthCell${isActive ? " is-active" : ""}`}
                >
                  <div className="monthTitle">
                    <span className="monthName">{monthName}</span>
                    <span className="monthNumber">
                      {index < 10 ? "0" + index : index}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </section>
  );
}
