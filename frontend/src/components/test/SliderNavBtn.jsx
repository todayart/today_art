import React from "react";
import { ReactSVG } from "react-svg";
import { useSwiper } from "swiper/react";

import PrevBtn from "../../assets/main/prevBtn.svg";
import NextBtn from "../../assets/main/nextBtn.svg";

export default function SliderNavBtn() {
  const swiper = useSwiper();
  return (
    <div className="buttonBox">
      {/* arrowPrev */}
      <div className="arrowPrev" onClick={() => swiper.slidePrev()}>
        <ReactSVG src={PrevBtn} />
      </div>
      {/* /arrowPrev */}
      {/* arrowNext */}
      <div className="arrowNext" onClick={() => swiper.slideNext()}>
        <ReactSVG src={NextBtn} />
      </div>
      {/* /arrowNext */}
    </div>
  );
}
