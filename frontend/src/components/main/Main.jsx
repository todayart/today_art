import React from "react";
import { ReactSVG } from "react-svg";

import Logoimg from "./Logoimg";
import MainSearch from "./MainSearch";
import CategoryTag from "./CategoryTag";
import CategoryList from "./CategoryList";
import CategoryBtn from "./CategoryBtn";

import CategoryBg from "../../assets/main/SemicircleBg.png";
import PlusIcon from "../../assets/main/plusIcon.svg";

export default function Main() {
  return (
    <>
      {/* mainBox */}
      <main className="mainBox">
        {/* title */}
        <section className="title">
          <div className="titleBox">
            {/* logoBox */}
            <div className="logoBox">
              <Logoimg />
            </div>
            {/* searchBox */}
            <div className="searchBox">
              <MainSearch />
            </div>
            {/* tagBox */}
            <div className="tagBox">
              <CategoryTag />
            </div>
          </div>
        </section>
        {/* Category */}
        <section className="category">
          {/* CategoryBox */}
          <div class="categoryBox">
            {/* listBox */}
            <CategoryList />
            {/* buttonBox */}
            <CategoryBtn />
            {/* detailBtn */}
            {/* detailBox */}
            <div className="detailBoxBtn">
              <a href="#">
                자세히보기
                <span className="detailIcon">
                  <ReactSVG src={PlusIcon} />
                </span>
              </a>
            </div>
            {/* /detailBox */}
          </div>
          <div className="categoryBg">
            <img src={CategoryBg} alt="CategoryBg" />
          </div>
        </section>
      </main>
    </>
  );
}
