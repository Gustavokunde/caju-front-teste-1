import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import Modal from "~/components/Modal";
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
  deleteRegistrationById: (id: number) => void;
}

export const RegistrationContext = createContext<RegistrationContextInterface>({
  refetch: async () => {},
  changeStatus: () => {
    return Promise.resolve();
  },
  createNewRegistration: (registration: Registration) => {
    return Promise.resolve();
  },
  deleteRegistrationById: (id: number) => {},
  setSearchField: (field: string) => {},
});

interface Props {
  children: JSX.Element;
}

export const RegistrationProvider = (props: Props) => {
  const [searchField, setSearchField] = useState("");
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["registrations"],
    queryFn: () => getRegistrations({ cpf: getOnlyNumbers(searchField) }),
  });

  const { mutateAsync: onChangeStatus, isPending } = useMutation({
    mutationFn: (param: {
      registration: Registration;
      status: REGISTRATION_STATUS;
    }) => changeRegistrationStatus(param.registration, param.status),
    onSuccess: () => {
      setModalMessage("Status alterado com sucesso!");
    },
    onError: () => {
      setModalMessage("Erro ao alterar o status.");
    },
  });

  const { mutateAsync: onNewRegistration } = useMutation({
    mutationFn: (registration: Registration) =>
      createRegistration(registration),
    onSuccess: () => {
      setModalMessage("Registro criado com sucesso!");
    },
    onError: () => {
      setModalMessage("Erro ao criar o registro.");
    },
  });

  const { mutateAsync: deleteRegistrationById } = useMutation({
    mutationFn: (id: number) => removeRegistration(id),
    onSuccess: () => {
      setModalMessage("Registro deletado com sucesso!");
    },
    onError: () => {
      setModalMessage("Erro ao deletar o registro.");
    },
  });

  const createNewRegistration = async (registration: Registration) => {
    setConfirmationMessage("Deseja criar este registro?");
    setConfirmAction(() => async () => {
      registration.status = REGISTRATION_STATUS.REVIEW;
      await onNewRegistration(registration);
    });
  };

  const changeStatus = async (
    registration: Registration,
    status: REGISTRATION_STATUS
  ) => {
    setConfirmationMessage("Deseja alterar o status deste registro?");
    setConfirmAction(() => async () => {
      await onChangeStatus({ registration, status });
      await refetch();
    });
  };

  const removeRegistration = async (id: number) => {
    setConfirmationMessage("Deseja deletar este registro?");
    setConfirmAction(() => async () => {
      await deleteRegistrationById(id);
      await refetch();
    });
  };

  const handleConfirmAction = async () => {
    if (confirmAction) await confirmAction();
    closeConfirmationModal();
  };

  const closeConfirmationModal = () => {
    setConfirmationMessage(null);
    setConfirmAction(null);
  };

  const closeMessageModal = () => {
    setModalMessage(null);
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrations: data,
        setSearchField,
        createNewRegistration,
        deleteRegistrationById,
        refetch,
        changeStatus,
      }}
    >
      {confirmationMessage && (
        <Modal
          isOpen={!!confirmationMessage}
          onClose={closeConfirmationModal}
          message={confirmationMessage}
          onConfirm={handleConfirmAction}
        />
      )}
      <Modal
        isOpen={!!modalMessage}
        onClose={closeMessageModal}
        message={modalMessage}
      />
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
    deleteRegistrationById,
  } = context;

  return {
    registrations,
    deleteRegistrationById,
    createNewRegistration,
    refetch,
    changeStatus,
    setSearchField,
  };
}
