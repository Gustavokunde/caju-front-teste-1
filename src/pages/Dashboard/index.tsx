import { useEffect } from "react";
import { useRegistration } from "../../hooks/useRegistration";
import Columns from "./components/Columns";
import { SearchBar } from "./components/Searchbar";
import * as S from "./styles";

const DashboardPage = () => {
  const { registrations, refetch, setSearchField } = useRegistration();

  useEffect(() => {
    if (registrations) refetch();
  }, []);

  const onSearchChanged = (search: string) => {
    setSearchField(search);
  };

  return (
    <S.Container>
      <SearchBar onSearchChanged={onSearchChanged} />
      <Columns />
    </S.Container>
  );
};
export default DashboardPage;
