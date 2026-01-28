import { useEffect } from "react";
import themeTokens from "contents/themeTokens.json";

const DEFAULT_THEMES = themeTokens.themes || themeTokens;

export default function ThemeModal({
  isOpen,
  onClose,
  onSelect,
  currentTheme = "default",
  themes = DEFAULT_THEMES || [],
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="themeModalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
      onClick={onClose}
    >
      <div
        className="themeModalPanel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="themeModalHeader">
          <h2 id="theme-modal-title">테마 선택</h2>
          <button
            type="button"
            className="themeModalClose"
            onClick={onClose}
            aria-label="테마 선택 모달 닫기"
          >
            닫기
          </button>
        </div>
        <ul className="themeModalGrid">
          {themes.map((theme) => (
            <li key={theme.value} className="themeModalItem">
              <button
                type="button"
                data-theme={theme.value}
                className={`themeModalButton ${
                  currentTheme === theme.value ? "is-active" : ""
                }`}
                onClick={() => onSelect?.(theme.value)}
              >
                <span className="themeModalLabel">{theme.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
