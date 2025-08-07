import CommonSelect from "components/Input/CommonSelect";
import { SORT_MAP } from "contents/sortOption";

export default function SortSelect({ sortOption, onSortChange }) {
  return (
    <>
      <CommonSelect
        labels={Object.keys(SORT_MAP)}
        selected={sortOption || "정렬순"}
        id="sortSelect"
        selectStyle={{ width: "150px" }}
        onChange={onSortChange}
      />
    </>
  );
}
