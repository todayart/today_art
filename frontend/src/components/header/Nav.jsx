import React from "react";
import { ReactComponent as HomeSvg } from "../../assets/home.svg";
import { ReactComponent as UserSvg } from "../../assets/user.svg";
import { ReactComponent as CalendarSvg } from "../../assets/calendar.svg";
import { ReactComponent as QuestionSvg } from "../../assets/question.svg";
import { ReactComponent as WishSvg } from "../../assets/wish.svg";

export default function Nav() {
  return (
    <nav>
      <ul className="navBox">
        <li>
          <a href="#">
            HOME
            <HomeSvg />
          </a>
        </li>
        <li>
          <a href="#">
            CALENDAR
            {/* calendaricon */}
            <CalendarSvg />
          </a>
        </li>
        <li>
          <a href="#">
            USER
            {/* usericon */}
            <UserSvg />
          </a>
        </li>
        <li>
          <a href="#">
            WISH
            {/* wishicon */}
            <WishSvg />
          </a>
        </li>
        <li>
          <a href="#">
            INFO
            {/* infoicon */}
            <QuestionSvg />
          </a>
        </li>
      </ul>
    </nav>
  );
}
