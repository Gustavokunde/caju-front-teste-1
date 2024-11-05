import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  changeRegistrationStatus,
  createRegistration,
  deleteRegistration,
  getRegistrations,
} from "~/services/registrations";
import { REGISTRATION_STATUS } from "~/types/registration";
import { RegistrationProvider, useRegistration } from "./useRegistration";

const queryClient = new QueryClient();
jest.mock("~/services/registrations", () => ({
  changeRegistrationStatus: jest.fn(),
  createRegistration: jest.fn(),
  deleteRegistration: jest.fn(),
  getRegistrations: jest.fn(),
}));

const TestComponent = () => {
  const {
    createNewRegistration,
    changeStatus,
    deleteRegistrationById,
    refetch,
  } = useRegistration();

  const registration = {
    id: 1,
    status: REGISTRATION_STATUS.REVIEW,
    employeeName: "User 1",
    cpf: "000.000.000-00",
    admissionDate: "01/01/2024",
    email: "email@email.com",
  };

  return (
    <div>
      <button onClick={() => createNewRegistration(registration)}>
        Create Registration
      </button>
      <button
        onClick={() => changeStatus(registration, REGISTRATION_STATUS.APPROVED)}
      >
        Change Status
      </button>
      <button onClick={() => deleteRegistrationById(1)}>
        Delete Registration
      </button>
      <button onClick={() => refetch()}>Refetch</button>
    </div>
  );
};

describe("RegistrationProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getRegistrations as jest.Mock).mockResolvedValue({});

    (createRegistration as jest.Mock).mockResolvedValue({});

    (changeRegistrationStatus as jest.Mock).mockResolvedValue({});

    (deleteRegistration as jest.Mock).mockResolvedValue({});
  });

  it("should show success message modal when creating a registration successfully", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("Create Registration"));

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toHaveTextContent(
        "Registro criado com sucesso!"
      );
    });
  });

  it("should show success message when update registration status successfully", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("Change Status"));

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toHaveTextContent(
        "Status alterado com sucesso!"
      );
    });
  });

  it(" should show modal message when removing a registration successfully", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("Delete Registration"));

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toHaveTextContent(
        "Registro deletado com sucesso!"
      );
    });
  });

  it("should show Loading when performing api requests", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RegistrationProvider>
          <TestComponent />
        </RegistrationProvider>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("Change Status"));

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });
});
