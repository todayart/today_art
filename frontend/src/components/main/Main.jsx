import React from "react";

import Logoimg from "./Logoimg";
import MainSearch from "./MainSearch";
import CategorieTag from "./CategorieTag";
import CategorieList from "./CategorieList";
import CategorieBtn from "./CategorieBtn";
import CategorieBg from "../../assets/main/SemicircleBg.png";

export default function Main() {
  return (
    <main className="mainBox">
      {/* title */}
      <section className="title">
        <div className="titleBox">
          {/* logoBox */}
          <div className="logoBox">
            <Logoimg/>
          </div>
          {/* searchBox */}
          <div className="searchBox">
            <MainSearch/>
          </div>
          {/* tagBox */}
          <div className="tagBox">
            <CategorieTag/>
          </div>
        </div>
      </section>
      {/* categorie */}
      <section className="categorie">
        {/* categorieBox */}
        <div class="categorieBox">
          {/* listBox */}
          <CategorieList/>
          {/* buttonBox */}
          <CategorieBtn/>
        </div>
        <div className="categorieBg">
          <img src={CategorieBg} alt="CategorieBg" />
        </div>
      </section>
    </main>
  ); 
}
