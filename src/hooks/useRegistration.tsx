import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import {
  changeRegistrationStatus,
  createRegistration,
  getRegistrations,
} from "~/services/registrations";
import { Registration, REGISTRATION_STATUS } from "~/types/registration";
import { getOnlyNumbers } from "~/utils/cpf";

interface RegistrationContextInterface {
  registrations?: Registration[];
  refetch: () => void;
  onChangeStatus: (
    registration: Registration,
    status: REGISTRATION_STATUS
  ) => Promise<void>;
  newRegistration: (registration: Registration) => Promise<void>;
}

export const RegistrationContext = createContext<RegistrationContextInterface>({
  refetch: async () => {},
  onChangeStatus: () => {
    return Promise.resolve();
  },
  newRegistration: (registration: Registration) => {
    return Promise.resolve();
  },
});

interface Props {
  children: JSX.Element;
  cpf: string;
}

export const RegistrationProvider = (props: Props) => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ["registrations"],
    queryFn: () => getRegistrations({ cpf: getOnlyNumbers(props.cpf) }),
  });

  const { mutateAsync: changeStatus, isIdle } = useMutation({
    mutationFn: (param: {
      registration: Registration;
      status: REGISTRATION_STATUS;
    }) => changeRegistrationStatus(param.registration, param.status),
  });

  const { mutateAsync: newRegistration } = useMutation({
    mutationFn: (registration: Registration) =>
      createRegistration(registration),
  });

  const onChangeStatus = async (
    registration: Registration,
    status: REGISTRATION_STATUS
  ) => {
    await changeStatus({ registration, status });
    await refetch();
  };

  return (
    <RegistrationContext.Provider
      value={{
        newRegistration,
        registrations: data,
        refetch,
        onChangeStatus,
      }}
    >
      {(isFetching || isIdle) && <p>Loading...</p>}
      {props.children}
    </RegistrationContext.Provider>
  );
};

export function useRegistration() {
  const context = useContext(RegistrationContext);
  const { registrations, newRegistration, refetch, onChangeStatus } = context;

  return {
    registrations,
    newRegistration,
    refetch,
    onChangeStatus,
  };
}
