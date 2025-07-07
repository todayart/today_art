import metaData from "../../contents/urlMeta.json";

export default function CategoryTag() {
  const categoryData =
    metaData.headerLinks.find((link) => link.category)?.category || [];

  return (
    <ul className="categoryBox">
      {categoryData.slice(0, 6).map((data, index) => (
        <li key={index} className="categoryTag">
          {data}
        </li>
      ))}
    </ul>
  );
}
