import React from "react";
import { ReactComponent as HomeSvg } from "../../assets/common/home.svg";
import { ReactComponent as CalendarSvg } from "../../assets/common/calendar.svg";
import { ReactComponent as UserSvg } from "../../assets/common/user.svg";
import { ReactComponent as WishSvg } from "../../assets/common/wish.svg";
import { ReactComponent as QuestionSvg } from "../../assets/common/question.svg";
import urlMeta from "../../contents/urlMeta.json";

export default function Nav() {
  // 컴포넌트 매핑
  const icons = { HomeSvg, CalendarSvg, UserSvg, WishSvg, QuestionSvg };

  return (
    <nav>
      <ul className="navBox">
        {urlMeta.navLinks.map((link) => {
          const Icon = icons[link.icon];
          return (
            <li key={link.name}>
              <a href={link.url}>{Icon && <Icon />}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
