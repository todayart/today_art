import { useEffect } from "react";

import Header from "components/header/Header";
import EntryMain from "components/main/EntryMain";

// import "styles/main/main.css";

export default function EntryPage() {
  useEffect(() => {
    console.log("EntryPage mounted");
  }, []);
  return (
    <>
      <Header />
      <EntryMain />
    </>
  );
}
