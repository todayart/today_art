import React from "react";

import Logoimg from "./Logoimg";
import MainSearch from "./MainSearch";
import KategorieTag from "./KategorieTag";
import KategorieList from "./KategorieList";
import KategorieBtn from "./KategorieBtn";
import KategorieBg from "../../assets/main/SemicircleBg.png";

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
            <KategorieTag/>
          </div>
        </div>
      </section>
      {/* kategorie */}
      <section className="kategorie">
        {/* kategorieBox */}
        <div class="kategorieBox">
          {/* listBox */}
          <KategorieList/>
          {/* buttonBox */}
          <KategorieBtn/>
        </div>
        <div className="KategorieBg">
          <img src={KategorieBg} alt="KategorieBg" />
        </div>
      </section>
    </main>
  ); 
}
