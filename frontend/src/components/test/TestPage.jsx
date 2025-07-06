import React, { useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "../../styles/test/test.css";

// import required modules
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";

import SliderNavBtn from "./SliderNavBtn";

export default function TestPage() {
  useEffect(() => {
    // 테스트용 axios 요청
    import("axios").then(({ default: axios }) => {
      axios
        .get("http://127.0.0.1:8000/")
        .then((response) => {
          console.log("Django 응답:", response.data);
        })
        .catch((error) => {
          console.error("Django 요청 에러:", error);
        });
    });
  }, []);

  const [djangoMessage, setDjangoMessage] = React.useState("");

  const handleTestButtonClick = () => {
    import("axios").then(({ default: axios }) => {
      axios
        .get("http://127.0.0.1:8000/react-test/")
        .then((response) => {
          setDjangoMessage(response.data.message);
        })
        .catch((error) => {
          setDjangoMessage("에러 발생: " + error.message);
        });
    });
  };

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={5}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
        className="swiperTest"
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
        <SliderNavBtn />
      </Swiper>

      <button className="testBtn" onClick={handleTestButtonClick}>
        테스트 버튼
      </button>
      {djangoMessage && <div className="django-message">{djangoMessage}</div>}
    </>
  );
}
