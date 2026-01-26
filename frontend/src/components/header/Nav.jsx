import { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import urlMeta from "contents/urlMeta.json";
import useMobile from "hooks/useMobile";
import MobileMenu from "components/mobile/MobileMenu";
import Tooltip from "components/common/Tooltip";
import SvgButton from "components/common/SvgButton";

const icons = {
  HomeSvg: require("../../assets/common/home.svg").default,
  CalendarSvg: require("../../assets/common/calendar.svg").default,
  UserSvg: require("../../assets/common/user.svg").default,
  WishSvg: require("../../assets/common/wish.svg").default,
  QuestionSvg: require("../../assets/common/question.svg").default,
  ColorThemaIconSvg: require("../../assets/common/colorThemaIcon.svg").default,
  // 모바일 메뉴 아이콘
  mobileMenu: {
    hamburgerIcon: require("../../assets/common/mobile/hamburger.svg").default,
    cancelIcon: require("../../assets/common/mobile/cancel.svg").default,
  },
};

export default function Nav() {
  // 테마 선택 모달 상태
  const [isModalOpen, setModalOpen] = useState(false);

  // 모바일 전용 상태
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuPanelRef = useRef(null);
  const toggleRef = useRef(null);

  // * 모바일 전용: 뷰포트 변경 시 메뉴 닫기 ----------------
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

  // 메뉴 외부 클릭 및 ESC 키 처리
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

  // 메뉴 토글 핸들러
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // * 네비게이션 링크 클릭 핸들러 ----------------
  const handleNavClick = (event, link) => {
    if (link?.type !== "action") return;
    event.preventDefault();
    setModalOpen(true);
  };

  return (
    <nav>
      <ul className="navBox">
        {isMobile ? (
          // 모바일 뷰포트인 경우 햄버거 버튼 렌더링
          <li>
            <SvgButton
              ref={toggleRef}
              icon={icons.mobileMenu.hamburgerIcon}
              label="메뉴 열기"
              onClick={toggleMenu}
              className="hamburgerBtn"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="메뉴 열기"
            />
          </li>
        ) : (
          // 기존 네비게이션 링크 렌더링
          urlMeta.navLinks.map((link) => {
            const svgSrc = icons[link.icon];
            return (
              <li key={link.name} className="navItem">
                {link.type === "action" ? (
                  <button
                    role="menuitem"
                    className={`${link.className} ${link.icon}` || ""}
                    onClick={(event) => handleNavClick(event, link)}
                  >
                    {svgSrc && <ReactSVG className="navButton" src={svgSrc} />}
                  </button>
                ) : (
                  <a
                    role="menuitem"
                    href={link.url || "#"}
                    className={`${link.className} ${link.icon}` || ""}
                  >
                    {svgSrc && <ReactSVG className="navA" src={svgSrc} />}
                  </a>
                )}
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
          cancelIcon={icons.mobileMenu.cancelIcon}
          onClose={() => setMenuOpen(false)}
          menuPanelRef={menuPanelRef}
        />
      )}
      {/* 테마 선택 모달 */}
      {isModalOpen && <div>모달 뷰</div>}
    </nav>
  );
}
