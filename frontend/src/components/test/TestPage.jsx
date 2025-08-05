import { useEffect } from "react";
import CommonHeader from "../header/CommonHeader";

export default function TestPage() {
  useEffect(() => {
    console.log("TestPage mounted");
  }, []);
  // return <CalendarPage />;
  return <CommonHeader />;
}
