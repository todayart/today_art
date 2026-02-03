import { useEffect } from "react";
import ExhibitionTag from "components/main/calendar/ExhibitionTag";

export default function TestPage() {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log("TestPage mounted");
  }, []);
  // return <CalendarPage />;
  return <ExhibitionTag name={"hellowold"} />;
}
