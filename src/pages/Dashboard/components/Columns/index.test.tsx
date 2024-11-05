import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Registration, REGISTRATION_STATUS } from "~/types/registration";
import { useRegistration } from "../../../../hooks/useRegistration";
import Columns from "../Columns";

jest.mock("../../../../hooks/useRegistration");

const mockedUseRegistration = useRegistration as jest.MockedFunction<
  typeof useRegistration
>;

describe("Columns Component", () => {
  const mockRegistrations: Registration[] = [
    {
      id: 1,
      status: REGISTRATION_STATUS.REVIEW,
      employeeName: "User 1",
      cpf: "000.000.000-00",
      admissionDate: "01/01/2024",
      email: "email@email.com",
    },
    {
      id: 2,
      status: REGISTRATION_STATUS.APPROVED,
      employeeName: "User 2",
      cpf: "000.000.000-00",
      admissionDate: "01/01/2024",
      email: "email@email.com",
    },
    {
      id: 3,
      status: REGISTRATION_STATUS.REPROVED,
      employeeName: "User 3",
      cpf: "000.000.000-00",
      admissionDate: "01/01/2024",
      email: "email@email.com",
    },
  ];

  beforeEach(() => {
    mockedUseRegistration.mockReturnValue({
      registrations: mockRegistrations,
      changeStatus: jest.fn(),
      createNewRegistration: jest.fn(),
      deleteRegistrationById: jest.fn(),
      refetch: jest.fn(),
      setSearchField: jest.fn(),
    });
  });

  it("should render all columns with correct titles", () => {
    render(<Columns />);

    expect(screen.getByText("Pronto para revisar")).toBeInTheDocument();
    expect(screen.getByText("Aprovado")).toBeInTheDocument();
    expect(screen.getByText("Reprovado")).toBeInTheDocument();
  });

  it("should render only RegistrationCards corresponding to column status", () => {
    render(<Columns />);

    const reviewColumn = screen.getByText("Pronto para revisar").closest("div");
    expect(reviewColumn).toHaveTextContent("User 1");

    const approvedColumn = screen.getByText("Aprovado").closest("div");
    expect(approvedColumn).toHaveTextContent("User 2");

    const reprovedColumn = screen.getByText("Reprovado").closest("div");
    expect(reprovedColumn).toHaveTextContent("User 3");
  });

  it("should not render cards where status does not match", () => {
    render(<Columns />);

    const reviewColumn = screen.getByText("Pronto para revisar").closest("div");
    expect(reviewColumn).not.toHaveTextContent("User 2");
    expect(reviewColumn).not.toHaveTextContent("User 3");

    const approvedColumn = screen.getByText("Aprovado").closest("div");
    expect(approvedColumn).not.toHaveTextContent("User 1");
    expect(approvedColumn).not.toHaveTextContent("User 3");

    const reprovedColumn = screen.getByText("Reprovado").closest("div");
    expect(reprovedColumn).not.toHaveTextContent("User 1");
    expect(reprovedColumn).not.toHaveTextContent("User 2");
  });
});
