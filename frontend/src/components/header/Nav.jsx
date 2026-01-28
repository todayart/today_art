import { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import urlMeta from "contents/urlMeta.json";
import useMobile from "hooks/useMobile";
import MobileMenu from "components/mobile/MobileMenu";
import Tooltip from "components/common/Tooltip";
import SvgButton from "components/common/SvgButton";
import ThemeModal from "components/common/ThemeModal";

const icons = {
  HomeSvg: require("../../assets/common/home.svg").default,
  CalendarSvg: require("../../assets/common/calendar.svg").default,
  UserSvg: require("../../assets/common/user.svg").default,
  WishSvg: require("../../assets/common/wish.svg").default,
  QuestionSvg: require("../../assets/common/question.svg").default,
  ColorThemeIconSvg: require("../../assets/common/colorThemeIcon.svg").default,
  // 모바일 메뉴 아이콘
  mobileMenu: {
    hamburgerIcon: require("../../assets/common/mobile/hamburger.svg").default,
    cancelIcon: require("../../assets/common/mobile/cancel.svg").default,
  },
};

export default function Nav() {
  // 테마 선택 전용 상태
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return window.localStorage.getItem("theme") || "default";
  });

  // 모바일 전용 상태
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuPanelRef = useRef(null);
  const toggleRef = useRef(null);

  // * 모바일 전용: 뷰포트 변경 시 메뉴 닫기 ----------------
  useEffect(() => {
    // 모바일이 아닐 때는 메뉴를 닫아 상태를 정리한다.
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  // 메뉴 외부 클릭 및 ESC 키 처리
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handlePointerDown = (event) => {
      const menuEl = menuPanelRef.current;
      const toggleEl = toggleRef.current;
      if (!menuEl) return;
      if (menuEl.contains(event.target)) return;
      if (toggleEl && toggleEl.contains(event.target)) return;
      setMobileMenuOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // * 테마 선택 처리 ----------------
  // 초기 로드 시 로컬 스토리지에서 테마 정보 불러오기
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);
  // 테마 변경 처리
  useEffect(() => {
    document.documentElement.setAttribute("color-theme", currentTheme);
    window.localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  // * 핸들러 -------------------------------------
  // 네비게이션 링크 클릭 핸들러 (테마 모달)
  const handleModalClick = (event, link) => {
    if (link?.type !== "action") return;
    event.preventDefault();
    setModalOpen(true);
  };
  const handleMobileAction = (link) => {
    if (link?.type !== "action") return;
    setModalOpen(true);
  };
  // 메뉴 토글 핸들러
  const toggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
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
              aria-expanded={mobileMenuOpen}
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
                    onClick={(e) => handleModalClick(e, link)}
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
                {/* 툴팁 표기 */}
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
          isOpen={mobileMenuOpen}
          navLinks={urlMeta.navLinks}
          icons={icons}
          cancelIcon={icons.mobileMenu.cancelIcon}
          onClose={() => setMobileMenuOpen(false)}
          onAction={handleMobileAction}
          menuPanelRef={menuPanelRef}
        />
      )}
      {/* 테마 선택 모달 */}
      {isModalOpen && (
        <ThemeModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          currentTheme={currentTheme}
          onSelect={(theme) => {
            setCurrentTheme(theme);
            setModalOpen(false);
          }}
        />
      )}
    </nav>
  );
}
