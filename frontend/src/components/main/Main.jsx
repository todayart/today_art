import React from "react";

import Logoimg from "./Logoimg";
import MainSearch from "./MainSearch";
import KategorieTag from "./KategorieTag";

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
          
        </div>
      </section>
    </main>
  ); 
}
