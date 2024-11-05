import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { REGISTRATION_STATUS } from "~/types/registration";
import { useRegistration } from "../../../../hooks/useRegistration";
import RegistrationCard from "../RegistrationCard";

jest.mock("../../../../hooks/useRegistration");

const mockedUseRegistration = useRegistration as jest.MockedFunction<
  typeof useRegistration
>;

describe("RegistrationCard Component", () => {
  const mockChangeStatus = jest.fn();
  const mockDeleteRegistrationById = jest.fn();

  const registrationData = {
    id: 1,
    employeeName: "John Doe",
    email: "john@example.com",
    cpf: "000.000.000-00",
    admissionDate: "2022-01-01",
    status: REGISTRATION_STATUS.REVIEW,
  };

  beforeEach(() => {
    mockedUseRegistration.mockReturnValue({
      registrations: [registrationData],
      changeStatus: mockChangeStatus,
      deleteRegistrationById: mockDeleteRegistrationById,
      createNewRegistration: jest.fn(),
      refetch: jest.fn(),
      setSearchField: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render information correctly", () => {
    render(<RegistrationCard data={registrationData} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("2022-01-01")).toBeInTheDocument();
  });

  it('should render buttons "Aprovar" and "Reprovar" when status is REVIEW', () => {
    render(<RegistrationCard data={registrationData} />);

    expect(screen.getByText("Aprovar")).toBeInTheDocument();
    expect(screen.getByText("Reprovar")).toBeInTheDocument();
  });

  it('should render button "Revisar novamente" when status is not REVIEW', () => {
    render(
      <RegistrationCard
        data={{ ...registrationData, status: REGISTRATION_STATUS.APPROVED }}
      />
    );

    expect(screen.getByText("Revisar novamente")).toBeInTheDocument();
  });

  it('should call changeStatus with REPROVED on clicking in "Reprovar"', () => {
    render(<RegistrationCard data={registrationData} />);

    const reproveButton = screen.getByText("Reprovar");
    fireEvent.click(reproveButton);

    expect(mockChangeStatus).toHaveBeenCalledWith(
      registrationData,
      REGISTRATION_STATUS.REPROVED
    );
  });

  it('should call changeStatus with APPROVED on clicking in "Aprovar"', () => {
    render(<RegistrationCard data={registrationData} />);

    const approveButton = screen.getByText("Aprovar");
    fireEvent.click(approveButton);

    expect(mockChangeStatus).toHaveBeenCalledWith(
      registrationData,
      REGISTRATION_STATUS.APPROVED
    );
  });

  it('should call changeStatus with REVIEW on clicking in "Revisar novamente"', () => {
    render(
      <RegistrationCard
        data={{ ...registrationData, status: REGISTRATION_STATUS.APPROVED }}
      />
    );

    const reviewButton = screen.getByText("Revisar novamente");
    fireEvent.click(reviewButton);

    expect(mockChangeStatus).toHaveBeenCalledWith(
      { ...registrationData, status: REGISTRATION_STATUS.APPROVED },
      REGISTRATION_STATUS.REVIEW
    );
  });

  it("should call deleteRegistrationById on clicking in trash icon", () => {
    render(<RegistrationCard data={registrationData} />);

    const deleteIcon = screen.getByTestId("trash-icon");
    fireEvent.click(deleteIcon);

    expect(mockDeleteRegistrationById).toHaveBeenCalledWith(
      registrationData.id
    );
  });
});
