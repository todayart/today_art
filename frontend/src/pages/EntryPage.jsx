import Header from "components/header/Header";
import Main from "components/main/Main";
import { useEffect } from "react";
// main.css 작성
import "styles/main/main.css";

export default function EntryPage() {
  useEffect(() => {
    console.log("EntryPage mounted");
  }, []);
  return (
    <>
      <Header />
      <Main />
    </>
  );
}
