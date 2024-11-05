import { yupResolver } from "@hookform/resolvers/yup";
import * as React from "react";
import { useForm } from "react-hook-form";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useHistory } from "react-router-dom";
import Button from "~/components/Buttons";
import { IconButton } from "~/components/Buttons/IconButton";
import TextField from "~/components/TextField";
import { useRegistration } from "~/hooks/useRegistration";
import routes from "~/router/routes";
import { Registration } from "~/types/registration";
import { formatCpf } from "~/utils/cpf";
import * as S from "./styles";
import { schema } from "./validation";

const NewUserPage = () => {
  const { createNewRegistration } = useRegistration();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { employeeName: "", email: "", cpf: "", admissionDate: "" },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const history = useHistory();
  const goToHome = () => {
    history.push(routes.dashboard);
  };

  const onSubmit = async (values: Registration) => {
    values.admissionDate = new Date(values.admissionDate).toLocaleDateString();
    await createNewRegistration(values);
    goToHome();
  };

  const inputHandler = (name: keyof Omit<Registration, "status" | "id">) => {
    return {
      ...register(name),
      error: errors[name]?.message,
    };
  };

  const handleCPFChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = formatCpf(event.target.value);
    setValue("cpf", value, { shouldValidate: true });
  };

  return (
    <S.Container>
      <S.Card onSubmit={handleSubmit(onSubmit)}>
        <IconButton onClick={goToHome} aria-label="back">
          <HiOutlineArrowLeft size={24} />
        </IconButton>
        <TextField
          {...inputHandler("employeeName")}
          placeholder="Nome"
          label="Nome"
        />
        <TextField
          {...inputHandler("email")}
          placeholder="Email"
          label="Email"
          type="email"
        />
        <TextField
          {...inputHandler("cpf")}
          onChange={handleCPFChange}
          placeholder="CPF"
          label="CPF"
        />
        <TextField
          {...inputHandler("admissionDate")}
          label="Data de admissão"
          type="date"
        />
        <Button>Cadastrar</Button>
      </S.Card>
    </S.Container>
  );
};

export default NewUserPage;
