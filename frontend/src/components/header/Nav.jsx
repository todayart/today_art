import { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import urlMeta from "contents/urlMeta.json";
import useMobile from "hooks/useMobile";
import MobileMenu from "components/mobile/MobileMenu";
import Tooltip from "components/common/Tooltip";

const icons = {
  HomeSvg: require("../../assets/common/home.svg").default,
  CalendarSvg: require("../../assets/common/calendar.svg").default,
  UserSvg: require("../../assets/common/user.svg").default,
  WishSvg: require("../../assets/common/wish.svg").default,
  QuestionSvg: require("../../assets/common/question.svg").default,
};

// 모바일 메뉴 아이콘
const hamburgerIcon =
  require("../../assets/common/mobile/hamburger.svg").default;
const cancelIcon = require("../../assets/common/mobile/cancel.svg").default;

export default function Nav() {
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuPanelRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    // 모바일이 아닐 때는 메뉴를 닫아 상태를 정리한다.
    if (!isMobile && menuOpen) {
      setMenuOpen(false);
    }
  }, [isMobile, menuOpen]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event) => {
      const menuEl = menuPanelRef.current;
      const toggleEl = toggleRef.current;
      if (!menuEl) return;
      if (menuEl.contains(event.target)) return;
      if (toggleEl && toggleEl.contains(event.target)) return;
      setMenuOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav>
      <ul className="navBox">
        {isMobile ? (
          // 모바일 뷰포트인 경우 햄버거 버튼 렌더링
          <li>
            <button
              type="button"
              className="hamburgerBtn"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="메뉴 열기"
              onClick={toggleMenu}
              ref={toggleRef}
            >
              <ReactSVG src={hamburgerIcon} />
            </button>
          </li>
        ) : (
          // 기존 네비게이션 링크 렌더링
          urlMeta.navLinks.map((link) => {
            const svgSrc = icons[link.icon];
            return (
              <li key={link.name} className="navItem">
                <a
                  role="menuitem"
                  href={link.url}
                  className={`${link.className} ${link.icon}` || ""}
                >
                  {svgSrc && <ReactSVG src={svgSrc} />}
                </a>
                {link.tooltip && (
                  <Tooltip className="navTooltip">{link.tooltip}</Tooltip>
                )}
              </li>
            );
          })
        )}
      </ul>
      {/* 모바일 레이아웃 메뉴 */}
      {isMobile && (
        <MobileMenu
          isOpen={menuOpen}
          navLinks={urlMeta.navLinks}
          icons={icons}
          cancelIcon={cancelIcon}
          onClose={() => setMenuOpen(false)}
          menuPanelRef={menuPanelRef}
        />
      )}
    </nav>
  );
}
