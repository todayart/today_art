import { ReactSVG } from "react-svg";

import Logoimg from "components/main/Logoimg";
import SvgButton from "components/common/SvgButton";

/**
 * MobileMenu 컴포넌트 - 모바일 오버레이 메뉴와 패널을 렌더링합니다.
 *
 * @component
 *
 * @param {Object} props - 컴포넌트 props 객체
 * @param {boolean} props.isOpen - 메뉴가 열려 있는지 여부. true일 경우 오버레이와 패널이 표시됩니다.
 * @param {Array.<{name: string, url: string, icon?: string}>} props.navLinks - 메뉴 항목 배열.
 *   각 항목은 표시할 이름(name), 이동할 URL(url), 선택적 아이콘 키(icon)를 가집니다.
 * @param {Object.<string, string>} props.icons - 아이콘 키를 SVG 경로(src)로 매핑한 객체 (예: { home: '/icons/home.svg' }).
 * @param {string|React.ReactNode} props.cancelIcon - 닫기 버튼에 사용할 아이콘(경로 문자열 또는 React 요소).
 * @param {function(): void} props.onClose - 메뉴를 닫을 때 호출되는 콜백 함수.
 * @param {function(Object): void} [props.onAction] - action 타입 메뉴 클릭 시 호출되는 콜백 함수.
 * @param {React.RefObject<HTMLElement>} props.menuPanelRef - 메뉴 패널에 전달되는 ref (포커스 관리나 접근성 처리용).
 *
 * @returns {JSX.Element} 렌더된 모바일 메뉴 요소
 *
 * @example
 * <MobileMenu
 *   isOpen={isOpen}
 *   navLinks={[{ name: '홈', url: '/', icon: 'home' }]}
 *   icons={{ home: '/icons/home.svg' }}
 *   cancelIcon="/icons/close.svg"
 *   onClose={() => setIsOpen(false)}
 *   menuPanelRef={menuRef}
 * />
 */

const MobileMenu = ({
  isOpen,
  navLinks,
  icons,
  cancelIcon,
  onClose,
  onAction,
  menuPanelRef,
}) => {
  return (
    <div
      id="mobile-menu"
      role="menu"
      aria-hidden={!isOpen}
      className={`mobileMenuOverlay ${isOpen ? "is-open" : ""}`}
      onClick={onClose}
    >
      <div
        className="mobileMenuPanel"
        ref={menuPanelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <SvgButton
          onClick={onClose}
          label="메뉴 닫기"
          aria-label="메뉴 닫기 버튼입니다"
          className="cancelBtn"
          icon={cancelIcon}
        />
        <section className="title">
          <div className="titleBox">
            <div className="logoBox">
              <Logoimg />
            </div>
          </div>
        </section>
        <ul className="mobileMenuList">
          {navLinks.map((link) => {
            const iconSrc = icons[link.icon];
            const label = link.tooltip || link.name;
            return (
              <li key={link.name}>
                {/* TODO : TAB 포커스 이동 검토 */}
                {link.type === "action" ? (
                  <button
                    type="button"
                    role="menuitem"
                    className="mobileMenuAction"
                    aria-label={label}
                    onClick={() => {
                      onClose();
                      onAction?.(link);
                    }}
                  >
                    {iconSrc && <ReactSVG src={iconSrc} />}
                    {link.name}
                  </button>
                ) : (
                  <a role="menuitem" href={link.url} onClick={onClose}>
                    {iconSrc && <ReactSVG src={iconSrc} />}
                    {link.name}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

MobileMenu.displayName = "MobileMenu";
export default MobileMenu;
