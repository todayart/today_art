import { useContext, useEffect } from "react";

import { EntryContext } from "contexts/EntryContext";

import ImgCard from "./ImgCard";

export default function CategoryList() {
  const entries = useContext(EntryContext);
  useEffect(() => {
    console.log("CategoryList Mounted");
  }, []);
  useEffect(() => {
    console.log("entries:", entries);
  }, [entries]);

  return (
    <div className="listBox">
      {/* listBox */}
      <ul>
        {/* imgCard는 5개까지만 나온다 */}
        {entries.slice(0, 5).map((entry) => (
          <ImgCard
            // key={entry.}
            title={entry.TITLE}
            address={entry.HOST_INST_NM}
            sPeriod={entry.BEGIN_DE}
            ePeriod={entry.END_DE}
            imageUrl={entry.IMAGE_URL}
          />
        ))}
      </ul>
      {/* /listBox */}
    </div>
  );
}
