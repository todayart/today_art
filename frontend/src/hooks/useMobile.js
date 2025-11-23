// src/hooks/useMobile.js

import { useEffect, useState } from "react";

/**
 * 현재 뷰포트가 모바일 크기인지 감지하는 커스텀 React 훅
 *
 * 이 훅은 윈도우의 내부 너비를 모니터링하고 768px 이하의 브레이크포인트를 기준으로
 * 디바이스가 모바일로 간주되는지 판단합니다. 윈도우 크기가 변경될 때 자동으로 업데이트됩니다.
 *
 * @returns {boolean} 뷰포트 너비가 768px 이하이면 true, 그렇지 않으면 false를 반환
 *
 * @example
 * // React 컴포넌트에서 기본 사용법
 * import useMobile from './hooks/useMobile';
 *
 * function MyComponent() {
 *   const isMobile = useMobile();
 *
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <p>모바일 화면</p>
 *       ) : (
 *         <p>데스크톱 화면</p>
 *       )}
 *     </div>
 *   );
 * }
 *
 * @example
 * // 네비게이션에서 조건부 렌더링과 함께 사용
 * function Navigation() {
 *   const isMobile = useMobile();
 *
 *   return (
 *     <nav>
 *       {isMobile ? (
 *         <HamburgerMenu />
 *       ) : (
 *         <DesktopMenu />
 *       )}
 *     </nav>
 *   );
 * }
 *
 * @example
 * // 조건부 스타일링과 함께 사용
 * function Card() {
 *   const isMobile = useMobile();
 *
 *   return (
 *     <div className={isMobile ? 'card-mobile' : 'card-desktop'}>
 *       여기에 내용
 *     </div>
 *   );
 * }
 */

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // 모바일 화면 너비 기준 설정 (예: 768px 이하)
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
};

export default useMobile;
