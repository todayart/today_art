import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * @fileoverview 테마 관리를 위한 Context API 구현
 * @module contexts/themeContext
 */

// 테마 컨텍스트 생성
const ThemeContext = createContext(null);

// 초기 테마 결정 함수
const getInitialTheme = () => {
  if (typeof window === "undefined") return "default";

  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme) return savedTheme;

  const prefersDark =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "default";
};

/**
 * 테마 컨텍스트 프로바이더 컴포넌트
 * 애플리케이션 전체에 테마 상태와 변경 함수를 제공합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 * @returns {JSX.Element} ThemeContext.Provider 컴포넌트
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({ children }) {
  // 테마 상태 관리
  const [theme, setTheme] = useState(getInitialTheme);
  // 시스템 다크 모드 선호 상태
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    function getSystemPrefersDark() {
      if (typeof window === "undefined") return false;
      return (
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    },
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 하이드레이션 완료 후 아주 짧은 지연시간 뒤에 트랜지션 허용
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 테마 변경 시 HTML 속성 및 로컬 스토리지 업데이트
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("color-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event) => {
      setSystemPrefersDark(event.matches);
      if (theme === "default") {
        document.documentElement.setAttribute(
          "color-theme",
          event.matches ? "dark" : "default",
        );
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // 컨텍스트 값 메모이제이션
  /**
   * 테마 컨텍스트 객체
   * @type {React.Context<{theme: string, setTheme: Function, isDark: boolean} | null>}
   */
  const value = useMemo(() => {
    return {
      theme,
      setTheme,
      isDark:
        theme.startsWith("dark") || (theme === "default" && systemPrefersDark),
    };
  }, [theme, systemPrefersDark]);

  // 컨텍스트 프로바이더 렌더링
  return (
    <div className={isReady ? "theme-transition-enabled" : ""}>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </div>
  );
}

// * 테마 컨텍스트 훅: 컨텍스트 값 접근
/**
 * 테마 컨텍스트 사용을 위한 커스텀 훅
 * ThemeProvider 내부에서만 사용 가능합니다.
 *
 * @returns {{theme: string, setTheme: Function, isDark: boolean}} 테마 관련 상태 및 함수
 * @throws {Error} ThemeProvider 외부에서 사용 시 에러 발생
 *
 * @example
 * const { theme, setTheme, isDark } = useTheme();
 * setTheme('dark-blue');
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme은 ThemeProvider 내부에서만 사용할 수 있습니다");
  }
  return ctx;
}
