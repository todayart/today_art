import CommonHeader from "../header/CommonHeader";
import ExhibitionLocationSelect from "../Input/ExhibitionLocationSelect";
import SmallSearchInput from "../Input/SmallSearchInput";
import "../../styles/main/main.css";
import PeriodInput from "../Input/PeriodInput";

export default function ListPage() {
  //TODO : PeriodInput에 사용될 OnRangeChange 함수를 생성해야함, 내용은 내용을 그대로 백앤드로 보내는 fetch함수이다.

  const handleRangeChange = ({ startDate, endDate }) => {
    console.log("Selected dates:", { startDate, endDate });
  };

  return (
    <CommonHeader>
      <ExhibitionLocationSelect
        labels={["전체", "서울", "부산", "대구"]}
        selected="전체"
      />
      <SmallSearchInput />
      <PeriodInput onRangeChange={handleRangeChange} />
    </CommonHeader>
  );
}
