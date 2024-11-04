import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import {
  changeRegistrationStatus,
  getRegistrations,
} from "~/services/registrations";
import { Registration, REGISTRATION_STATUS } from "~/types/registration";
import { getOnlyNumbers } from "~/utils/cpf";

interface RegistrationContextInterface {
  registrations?: Registration[];
  searchRegistrations: (cpf?: string) => void;
  onChangeStatus: (
    registration: Registration,
    status: REGISTRATION_STATUS
  ) => Promise<void>;
}

export const RegistrationContext = createContext<RegistrationContextInterface>({
  registrations: null,
  searchRegistrations: async (cpf?: string) => {
    return cpf;
  },
  onChangeStatus: () => {
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

  console.log(isFetching);
  useEffect(() => {
    searchRegistrations();
  }, [props.cpf]);

  const searchRegistrations = async () => {
    refetch();
  };

  const onChangeStatus = async (
    registration: Registration,
    status: REGISTRATION_STATUS
  ) => {
    await changeRegistrationStatus(registration, status);
    await searchRegistrations();
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrations: data,
        searchRegistrations,
        onChangeStatus,
      }}
    >
      {isFetching && <p>Loading...</p>}
      {props.children}
    </RegistrationContext.Provider>
  );
};

export function useRegistration() {
  const context = useContext(RegistrationContext);
  const { registrations, searchRegistrations, onChangeStatus } = context;

  return {
    registrations,
    searchRegistrations,
    onChangeStatus,
  };
}
