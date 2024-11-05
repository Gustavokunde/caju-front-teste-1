import { useState } from "react";
import { RegistrationProvider } from "../../hooks/useRegistration";
import Columns from "./components/Columns";
import { SearchBar } from "./components/Searchbar";
import * as S from "./styles";

const DashboardPage = () => {
  const [cpf, setCpf] = useState("");

  const onSearchChanged = (search: string) => {
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
