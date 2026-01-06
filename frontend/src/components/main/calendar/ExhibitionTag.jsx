import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

/**
 * 긴 직사각형 내부에 전시 이름을 표시하는 태그 컴포넌트입니다.
 *
 * @param {{ name: string }} props
 * @param {string} props.name - 태그에 표시할 전시 이름
 * @returns {JSX.Element}
 * @example
 * ```jsx
 * <ExhibitionTag name="아트페어 2025: 현대미술의 흐름" />
 * ```
 */

const ExhibitionTag = ({ name }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/list?title=${encodeURIComponent(name)}`);
  }, [name, navigate]);

  return (
    <div
      className="exhibitionTag commonBorder textOverflow overflowHidden shadow"
      title={`${name}의 태그`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      {name}
    </div>
  );
};

export default ExhibitionTag;
