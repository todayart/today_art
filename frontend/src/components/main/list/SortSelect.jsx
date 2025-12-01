import CustomSelect from "components/common/CustomSelect";
import { SORT_MAP } from "contents/sortOption";

export default function SortSelect({ sortOption, onSortChange }) {
  const options = Object.keys(SORT_MAP).map((label) => ({
    label,
    value: label,
  }));

  return (
    <CustomSelect
      value={sortOption || "정렬순"}
      onChange={onSortChange}
      options={options}
      placeholder="정렬순"
      width="150px"
    />
  );
}
