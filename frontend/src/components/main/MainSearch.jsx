import React from "react";
import { ReactSVG } from "react-svg";
// ReactSVG 사용하면 SVG파일을 불러와서 사용할 수 있음
import SearchSvg from "../../assets/main/search.svg";

export default function MainSearch(){
    return( 
        <div className="searchGroup">
            {/* searchGroupInner */}
            <div className="searchGroupInner">
                {/* searchInput */}
                <input className="searchInput" type="text"/>
                {/* searchInput */}
                {/* search button */}
                <button>
                    <ReactSVG src={SearchSvg} />
                </button>
                {/* search button */}
            </div>
            {/* searchGroupInner */}
        </div>
    );
}

