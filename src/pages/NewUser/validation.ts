import { object, string } from "yup";
import { isCpfValid } from "~/utils/cpf";

export const schema = object().shape({
  email: string()
    .email("Insira um email válido")
    .required("Email é obrigatório"),
  employeeName: string()
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ]+(\s[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
      "Insira o nome completo e válido"
    )
    .required("Nome completo é obrigatório"),
  cpf: string()
    .test("valid-cpf", "Insira um CPF válido", (value) => isCpfValid(value!))
    .required("CPF é obrigatório"),
  admissionDate: string().required("Data de admissão é obrigatória"),
});
