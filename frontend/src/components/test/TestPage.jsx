import { useEffect } from "react";
import ExhibitionTag from "../calendar/ExhibitionTag";

export default function TestPage() {
  useEffect(() => {
    console.log("TestPage mounted");
  }, []);
  // return <CalendarPage />;
  return <ExhibitionTag name={"hellowold"} />;
}
