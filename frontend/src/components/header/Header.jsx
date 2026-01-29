import Nav from "./Nav";

/**
 * 엔트리 페이지 전용 헤더 컴포넌트
 */
export default function Header({ currentTheme, onThemeChange }) {
  return (
    <header>
      <Nav currentTheme={currentTheme} onThemeChange={onThemeChange} />
    </header>
  );
}
