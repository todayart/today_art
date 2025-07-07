import React from "react";
import { ReactSVG } from "react-svg";
import urlMeta from "../../contents/urlMeta.json";

// Use require to import SVG file paths
const icons = {
  HomeSvg: require("../../assets/common/home.svg").default,
  CalendarSvg: require("../../assets/common/calendar.svg").default,
  UserSvg: require("../../assets/common/user.svg").default,
  WishSvg: require("../../assets/common/wish.svg").default,
  QuestionSvg: require("../../assets/common/question.svg").default,
};

export default function Nav() {
  return (
    <nav>
      <ul className="navBox">
        {urlMeta.navLinks.map((link) => {
          const svgSrc = icons[link.icon];
          return (
            <li key={link.name}>
              <a href={link.url}>{svgSrc && <ReactSVG src={svgSrc} />}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
