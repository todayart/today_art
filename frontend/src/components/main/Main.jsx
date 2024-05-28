import React from "react";
import { ReactSVG } from "react-svg";

import Logoimg from "./Logoimg";
import MainSearch from "./MainSearch";
import CategorieTag from "./CategorieTag";
import CategorieList from "./CategorieList";
import CategorieBtn from "./CategorieBtn";

import CategorieBg from "../../assets/main/SemicircleBg.png";
import PlusIcon from "../../assets/main/plusIcon.svg";

export default function Main() {
  return (
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
            <CategorieTag />
          </div>
        </div>
      </section>
      {/* categorie */}
      <section className="categorie">
        {/* categorieBox */}
        <div class="categorieBox">
          {/* listBox */}
          <CategorieList />
          {/* buttonBox */}
          <CategorieBtn />
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
        <div className="categorieBg">
          <img src={CategorieBg} alt="CategorieBg" />
        </div>
      </section>
    </main>
  );
}
