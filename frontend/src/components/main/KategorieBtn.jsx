import React from "react";
import { ReactSVG } from "react-svg";

import PrevBtn from "../../assets/main/prevBtn.svg";
import NextBtn from "../../assets/main/nextBtn.svg";


export default function KategorieBtn(){
    return(
        <div className="buttonBox">
            {/* arrowPrev */}
            <div className="arrowPrev">
                <ReactSVG src={PrevBtn} />
            </div>
            {/* /arrowPrev */}
            {/* arrowNext */}
            <div className="arrowNext">
                <ReactSVG src={NextBtn} />
            </div>
            {/* /arrowNext */}
        </div>
    );
}