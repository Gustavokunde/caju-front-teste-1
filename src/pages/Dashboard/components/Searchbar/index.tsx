import { useEffect, useState } from "react";
import { HiRefresh } from "react-icons/hi";
import { useHistory } from "react-router-dom";
import Button from "~/components/Buttons";
import { IconButton } from "~/components/Buttons/IconButton";
import TextField from "~/components/TextField";
import routes from "~/router/routes";
import { useRegistration } from "../../hooks/useRegistration";
import * as S from "./styles";

interface Props {
  onSearchChanged: (search: string) => void;
}

export const SearchBar = (props: Props) => {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const { searchRegistrations } = useRegistration();

  const goToNewAdmissionPage = () => {
    history.push(routes.newUser);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearch(event.target.value);
  };

  const onRefresh = () => {
    searchRegistrations();
  };

  useEffect(() => {
    props.onSearchChanged(search);
  }, [search]);

  return (
    <S.Container>
      <TextField placeholder="Digite um CPF válido" onChange={onChange} />
      <S.Actions>
        <IconButton aria-label="refetch" onClick={onRefresh}>
          <HiRefresh />
        </IconButton>
        <Button onClick={goToNewAdmissionPage}>Nova Admissão</Button>
      </S.Actions>
    </S.Container>
  );
};
