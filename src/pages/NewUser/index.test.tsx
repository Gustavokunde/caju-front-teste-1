import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useHistory } from "react-router-dom";
import { useRegistration } from "~/hooks/useRegistration";
import { formatCpf } from "~/utils/cpf";
import NewUserPage from "./";

jest.mock("~/hooks/useRegistration");

const mockedUseRegistration = useRegistration as jest.MockedFunction<
  typeof useRegistration
>;

jest.mock("~/utils/cpf", () => ({
  formatCpf: jest.fn((cpf) => cpf),
  isCpfValid: jest.fn((cpf) => cpf),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: jest.fn(),
}));

describe("NewUserPage Component", () => {
  const mockCreateNewRegistration = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useHistory as jest.Mock).mockReturnValue({ push: mockPush });
    mockedUseRegistration.mockReturnValue({
      createNewRegistration: mockCreateNewRegistration,
      changeStatus: jest.fn(),
      deleteRegistrationById: jest.fn(),
      refetch: jest.fn(),
      registrations: [],
      setSearchField: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show all fields and button Cadastrar", () => {
    render(<NewUserPage />);

    expect(screen.getByTestId("employeeName")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("cpf")).toBeInTheDocument();
    expect(screen.getByTestId("admissionDate")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cadastrar" })
    ).toBeInTheDocument();
  });

  it("should show validation error when submitting form empty", async () => {
    render(<NewUserPage />);

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

    await waitFor(() => {
      expect(
        screen.getByText("Insira o nome completo e válido")
      ).toBeInTheDocument();
      expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("Insira um CPF válido")).toBeInTheDocument();
      expect(
        screen.getByText("Data de admissão é obrigatória")
      ).toBeInTheDocument();
    });
  });

  it("should call formatCpf and update document number", () => {
    render(<NewUserPage />);

    const cpfInput = screen.getByPlaceholderText("CPF");
    fireEvent.change(cpfInput, { target: { value: "12345678900" } });

    expect(formatCpf).toHaveBeenCalledWith("12345678900");
  });

  it("should submit form with valid data and then redirects dto dashboard ", async () => {
    render(<NewUserPage />);

    fireEvent.change(screen.getByTestId("employeeName"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTestId("cpf"), {
      target: { value: "19769059072" },
    });
    fireEvent.change(screen.getByTestId("admissionDate"), {
      target: { value: "2024-01-02" },
    });

    screen.getByRole("button", { name: "Cadastrar" }).click();
    await waitFor(() => {
      expect(mockCreateNewRegistration).toHaveBeenCalledWith({
        employeeName: "John Doe",
        email: "john@example.com",
        cpf: "19769059072",
        admissionDate: "1/1/2024",
      });
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it(" should redirect to dashboard when clicking in back button ", () => {
    render(<NewUserPage />);

    fireEvent.click(screen.getByLabelText("back"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
