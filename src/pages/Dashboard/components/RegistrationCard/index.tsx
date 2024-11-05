import {
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlineTrash,
  HiOutlineUser,
} from "react-icons/hi";
import { ButtonSmall } from "~/components/Buttons";
import { Registration, REGISTRATION_STATUS } from "~/types/registration";
import { useRegistration } from "../../../../hooks/useRegistration";
import * as S from "./styles";

type Props = {
  data: Registration;
};

const RegistrationCard = ({ data }: Props) => {
  const { onChangeStatus } = useRegistration();

  return (
    <S.Card>
      <S.IconAndText>
        <HiOutlineUser />
        <h3>{data.employeeName}</h3>
      </S.IconAndText>
      <S.IconAndText>
        <HiOutlineMail />
        <p>{data.email}</p>
      </S.IconAndText>
      <S.IconAndText>
        <HiOutlineCalendar />
        <span>{data.admissionDate}</span>
      </S.IconAndText>
      <S.Actions>
        <div>
          {data.status == REGISTRATION_STATUS.REVIEW && (
            <ButtonSmall
              bgcolor="rgb(255, 145, 154)"
              onClick={() => onChangeStatus(data, REGISTRATION_STATUS.REPROVED)}
            >
              Reprovar
            </ButtonSmall>
          )}
          {data.status == REGISTRATION_STATUS.REVIEW && (
            <ButtonSmall
              bgcolor="rgb(155, 229, 155)"
              onClick={() => onChangeStatus(data, REGISTRATION_STATUS.APPROVED)}
            >
              Aprovar
            </ButtonSmall>
          )}
          {data.status !== REGISTRATION_STATUS.REVIEW && (
            <ButtonSmall
              bgcolor="#ff8858"
              onClick={() => onChangeStatus(data, REGISTRATION_STATUS.REVIEW)}
            >
              Revisar novamente
            </ButtonSmall>
          )}
        </div>
        <HiOutlineTrash />
      </S.Actions>
    </S.Card>
  );
};

export default RegistrationCard;
