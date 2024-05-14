import React from "react";
// todo herf 부분을 신경써야 한다.
// ! 키포인트는 팀원이 활용할 수 있어야 한다.

export default function NavItems(title, children) {
  return (
    <li>
      <a href="#">
        {title}
        {children}
      </a>
    </li>
  );
}
