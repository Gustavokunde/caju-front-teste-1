import { REGISTRATION_STATUS } from "~/types/registration";
import { useRegistration } from "../../../../hooks/useRegistration";
import RegistrationCard from "../RegistrationCard";
import * as S from "./styles";

const allColumns: {
  status: REGISTRATION_STATUS;
  title: string;
}[] = [
  { status: REGISTRATION_STATUS.REVIEW, title: "Pronto para revisar" },
  { status: REGISTRATION_STATUS.APPROVED, title: "Aprovado" },
  { status: REGISTRATION_STATUS.REPROVED, title: "Reprovado" },
];

const Columns = () => {
  const { registrations } = useRegistration();

  return (
    <S.Container>
      {allColumns.map((column) => {
        return (
          <S.Column status={column.status} key={column.title}>
            <>
              <S.TitleColumn status={column.status}>
                {column.title}
              </S.TitleColumn>
              <S.ColumnContent>
                {registrations?.map(
                  (registration) =>
                    registration.status === column.status && (
                      <RegistrationCard
                        data={registration}
                        key={registration.id}
                      />
                    )
                )}
              </S.ColumnContent>
            </>
          </S.Column>
        );
      })}
    </S.Container>
  );
};
export default Columns;
