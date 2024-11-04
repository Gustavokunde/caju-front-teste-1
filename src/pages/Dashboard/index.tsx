import { useState } from "react";
import Columns from "./components/Columns";
import { SearchBar } from "./components/Searchbar";
import { RegistrationProvider } from "./hooks/useRegistration";
import * as S from "./styles";

const DashboardPage = () => {
  const [cpf, setCpf] = useState("");

  const onSearchChanged = (search: string) => {
    console.log("onsearch");
    setCpf(search);
  };

  return (
    <RegistrationProvider cpf={cpf}>
      <S.Container>
        <SearchBar onSearchChanged={onSearchChanged} />
        <Columns />
      </S.Container>
    </RegistrationProvider>
  );
};
export default DashboardPage;
