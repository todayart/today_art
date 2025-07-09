import CommonHeader from "../header/CommonHeader";
import ExhibitionLocationSelect from "../Input/ExhibitionLocationSelect";
import SmallSearchInput from "../Input/SmallSearchInput";
import "../../styles/main/main.css";

export default function ListPage() {
  return (
    <CommonHeader>
      <ExhibitionLocationSelect
        labels={["전체", "서울", "부산", "대구"]}
        selected="전체"
        // onChange={(value) => console.log(value)}
      />
      <SmallSearchInput />
    </CommonHeader>
  );
}
