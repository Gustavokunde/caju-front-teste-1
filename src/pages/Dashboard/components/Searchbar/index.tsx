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

const getOnlyNumbers = (value: string) => {
  return value?.replace(/[^\d]+/g, "");
};

const formatCpf = (cpf: string) => {
  cpf = getOnlyNumbers(cpf);
  if (cpf.length > 11) {
    cpf = cpf.slice(0, 11);
  }
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const isCpfValid = (cpf: string) => {
  cpf = getOnlyNumbers(cpf);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  for (let j = 9; j < 11; j++) {
    let sum = 0;
    for (let i = 0; i < j; i++) {
      sum += parseInt(cpf[i]) * (j + 1 - i);
    }
    let digit = (sum * 10) % 11;
    if (digit === 10) digit = 0;
    if (digit !== parseInt(cpf[j])) return false;
  }

  return true;
};

export const SearchBar = (props: Props) => {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const { searchRegistrations } = useRegistration();

  const goToNewAdmissionPage = () => {
    history.push(routes.newUser);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    setSearch(formatCpf(value));
  };

  const onRefresh = () => {
    searchRegistrations();
  };

  useEffect(() => {
    if (isCpfValid(search) || !search) props.onSearchChanged(search);
  }, [search]);

  return (
    <S.Container>
      <TextField
        value={search}
        placeholder="Digite um CPF válido"
        onChange={onChange}
      />
      <S.Actions>
        <IconButton aria-label="refetch" onClick={onRefresh}>
          <HiRefresh />
        </IconButton>
        <Button onClick={goToNewAdmissionPage}>Nova Admissão</Button>
      </S.Actions>
    </S.Container>
  );
};
