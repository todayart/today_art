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
// TODO : 태그를 누르면 상세보기로 이동하는 기능 추가 그렇다면 부모의 EXHIBITION 객체의 구조를 바꿔야 함

const ExhibitionTag = ({ name }) => {
  return (
    <div
      className="exhibitionTag commonBorder flexCenter textOverflow"
      title={`${name}의 태그`} // 전체 이름을 툴팁으로 보여줌
    >
      {name}
    </div>
  );
};

export default ExhibitionTag;
