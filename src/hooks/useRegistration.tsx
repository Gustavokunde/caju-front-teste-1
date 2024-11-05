import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
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
  changeStatus: (
    registration: Registration,
    status: REGISTRATION_STATUS
  ) => Promise<void>;
  createNewRegistration: (registration: Registration) => Promise<void>;
  setSearchField: (field: string) => void;
}

export const RegistrationContext = createContext<RegistrationContextInterface>({
  refetch: async () => {},
  changeStatus: () => {
    return Promise.resolve();
  },
  createNewRegistration: (registration: Registration) => {
    return Promise.resolve();
  },
  setSearchField: (field: string) => {},
});

interface Props {
  children: JSX.Element;
}

export const RegistrationProvider = (props: Props) => {
  const [searchField, setSearchField] = useState("");

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["registrations"],
    queryFn: () => getRegistrations({ cpf: getOnlyNumbers(searchField) }),
  });

  const { mutateAsync: onChangeStatus, isPending } = useMutation({
    mutationFn: (param: {
      registration: Registration;
      status: REGISTRATION_STATUS;
    }) => changeRegistrationStatus(param.registration, param.status),
  });

  const { mutateAsync: onNewRegistration } = useMutation({
    mutationFn: (registration: Registration) =>
      createRegistration(registration),
  });

  const createNewRegistration = async (registration: Registration) => {
    registration.status = REGISTRATION_STATUS.REVIEW;
    await onNewRegistration(registration);
  };

  const changeStatus = async (
    registration: Registration,
    status: REGISTRATION_STATUS
  ) => {
    await onChangeStatus({ registration, status });
    await refetch();
  };
  return (
    <RegistrationContext.Provider
      value={{
        setSearchField,
        createNewRegistration,
        registrations: data,
        refetch,
        changeStatus,
      }}
    >
      {(isFetching || isLoading || isPending) && <p>Loading...</p>}
      {props.children}
    </RegistrationContext.Provider>
  );
};

export function useRegistration() {
  const context = useContext(RegistrationContext);
  const {
    registrations,
    createNewRegistration,
    refetch,
    changeStatus,
    setSearchField,
  } = context;

  return {
    registrations,
    createNewRegistration,
    refetch,
    changeStatus,
    setSearchField,
  };
}
