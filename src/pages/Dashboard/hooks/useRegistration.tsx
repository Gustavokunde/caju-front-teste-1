import { createContext, useContext, useEffect, useState } from "react";
import {
  changeRegistrationStatus,
  getRegistrations,
} from "~/services/registrations";
import { Registration, REGISTRATION_STATUS } from "~/types/registration";

interface RegistrationContextInterface {
  registrations: Registration[] | null;
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
  const [registrations, setRegistrations] = useState<Registration[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    searchRegistrations(props.cpf);
  }, [props.cpf]);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const searchRegistrations = async (cpf?: string) => {
    startLoading();
    const response = await getRegistrations({ cpf });
    setRegistrations(response.data);
    stopLoading();
  };

  const onChangeStatus = async (
    registration: Registration,
    status: REGISTRATION_STATUS
  ) => {
    startLoading();
    await changeRegistrationStatus(registration, status);
    await searchRegistrations();
    stopLoading();
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrations,
        searchRegistrations,
        onChangeStatus,
      }}
    >
      {loading && <p>Loading...</p>}
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
