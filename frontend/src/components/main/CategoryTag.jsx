import metaData from "contents/urlMeta.json";
import { memo, useMemo } from "react";

function CategoryTag({ handleCategoryClick = () => {} }) {
  const categoryData = useMemo(() => {
    const foundLink = metaData.headerLinks.find((link) => link.category);
    return foundLink?.category || [];
  }, []);

  return (
    <ul>
      {categoryData.slice(0, 6).map((data, index) => (
        <li
          key={index}
          className="categoryTag"
          onClick={() => handleCategoryClick(data)}
        >
          {data}
        </li>
      ))}
    </ul>
  );
}

export default memo(CategoryTag);
