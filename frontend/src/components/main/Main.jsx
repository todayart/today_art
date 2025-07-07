import { ReactSVG } from "react-svg";

import Logoimg from "./Logoimg";
import MainSearch from "./MainSearch";
import CategoryTag from "./CategoryTag";
import CategoryList from "./CategoryList";
import DetailBtn from "./DetailBtn";

import PrevBtn from "../../assets/main/prevBtn.svg";

export default function Main() {
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
              <CategoryTag />
            </div>
          </div>
        </section>
        {/* Category = postlists ------------- */}
        <section className="category">
          <div className="categoryBox">
            {/* arrowPrev */}
            <div className="arrowPrev">
              <ReactSVG src={PrevBtn} />
            </div>
            {/* /arrowPrev */}
            <CategoryList />
            <DetailBtn />
          </div>
          <div className="categoryBg"></div>
        </section>
      </main>
    </>
  );
}
