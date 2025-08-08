import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";

import Logoimg from "./Logoimg";
import MainSearch from "./MainSearch";
import CategoryTag from "./CategoryTag";
import CategoryList from "./CategoryList";
import DetailBtn from "./DetailBtn";

import PrevBtn from "assets/main/prevBtn.svg";

import { useCachedEntries } from "hooks/useCachedEntries";

export default function EntryMain() {
  const navigate = useNavigate();
  const { entries, loading, error } = useCachedEntries();

  // 카테고리 클릭 시
  const onCategoryClick = (cateValue) => {
    navigate(`/list?cate=${encodeURIComponent(cateValue)}`);
  };

  // 이미지 카드 클릭 시
  const onImgCardClick = (titleValue) => {
    navigate(`/list?title=${encodeURIComponent(titleValue)}`);
  };

  return (
    <>
      {/* Main Content Part */}
      <main className="mainBox">
        {/* Title Section -------------------*/}
        <section className="title">
          <div className="titleBox">
            <div className="logoBox">
              <Logoimg />
            </div>
            <div className="searchBox">
              <MainSearch />
            </div>
            <div className="tagBox">
              <CategoryTag handleCategoryClick={onCategoryClick} />
            </div>
          </div>
        </section>
        {/* Category = postlists ------------- */}
        <section className="category">
          <div className="categoryBox">
            {loading ? (
              <div className="statusMessage">Loading...</div>
            ) : error ? (
              <div className="statusMessage">
                Error occurred: {error.message}
              </div>
            ) : (
              <>
                {/* arrowPrev */}
                <div className="arrowPrev">
                  <ReactSVG src={PrevBtn} />
                </div>
                {/* /arrowPrev */}
                <CategoryList
                  entries={entries}
                  handleImgCardClick={onImgCardClick}
                />
                {/* 디테일 버튼 */}
                <DetailBtn href={"/list"} />
              </>
            )}
          </div>
          <div className="categoryBg"></div>
        </section>
      </main>
    </>
  );
}
