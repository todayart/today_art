import { ReactSVG } from "react-svg";
import Logoimg from "../main/Logoimg";

export default function MobileMenu({
  isOpen,
  navLinks,
  icons,
  cancelIcon,
  onClose,
  menuPanelRef,
}) {
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
        <button
          type="button"
          onClick={onClose}
          aria-label="메뉴 닫기"
          className="cancelBtn"
        >
          <ReactSVG src={cancelIcon} />
        </button>
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
            return (
              <li key={link.name}>
                <a role="menuitem" href={link.url} onClick={onClose}>
                  {iconSrc && <ReactSVG src={iconSrc} />}
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
