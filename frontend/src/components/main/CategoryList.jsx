import { useEffect } from "react";

import ImgCard from "./ImgCard";

export default function CategoryList({ handleImgCardClick, entries }) {
  useEffect(() => {
    console.log("CategoryList Mounted");
  }, []);

  useEffect(() => {
    console.log("entries:", entries);
  }, [entries]);

  return (
    <div className="listBox">
      <ul>
        {entries.slice(0, 5).map((entry, index) => (
          <ImgCard
            key={index}
            title={entry.TITLE}
            address={entry.HOST_INST_NM}
            sPeriod={entry.BEGIN_DE}
            ePeriod={entry.END_DE}
            imageUrl={entry.IMAGE_URL}
            onClick={() => handleImgCardClick(entry.TITLE)}
          />
        ))}
      </ul>
    </div>
  );
}
