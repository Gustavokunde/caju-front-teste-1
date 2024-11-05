import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useHistory } from "react-router-dom";
import routes from "~/router/routes";
import { isCpfValid } from "~/utils/cpf";
import { SearchBar } from ".";
import { useRegistration } from "../../../../hooks/useRegistration";

jest.mock("../../../../hooks/useRegistration");

const mockedUseRegistration = useRegistration as jest.MockedFunction<
  typeof useRegistration
>;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: jest.fn(),
}));

jest.mock("~/utils/cpf", () => ({
  formatCpf: jest.fn((value) => value),
  isCpfValid: jest.fn(),
}));

describe("SearchBar Component", () => {
  const mockRefetch = jest.fn();
  const mockOnSearchChanged = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    mockedUseRegistration.mockReturnValue({
      refetch: mockRefetch,
      registrations: [],
      changeStatus: jest.fn(),
      deleteRegistrationById: jest.fn(),
      createNewRegistration: jest.fn(),
      setSearchField: jest.fn(),
    });
    (useHistory as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it("should call onSearchChanged when CPF is valid", () => {
    (isCpfValid as jest.Mock).mockReturnValue(true);

    render(<SearchBar onSearchChanged={mockOnSearchChanged} />);

    const input = screen.getByPlaceholderText("Digite um CPF válido");
    fireEvent.change(input, { target: { value: "123.456.789-00" } });

    expect(mockOnSearchChanged).toHaveBeenCalledWith("123.456.789-00");
    expect(isCpfValid).toHaveBeenCalledWith("123.456.789-00");
    expect(isCpfValid).toHaveBeenCalledTimes(2);
  });

  it("should not call onSearchChanged when CPF is not valid", () => {
    (isCpfValid as jest.Mock).mockReturnValue(false);

    render(<SearchBar onSearchChanged={mockOnSearchChanged} />);

    const input = screen.getByPlaceholderText("Digite um CPF válido");
    fireEvent.change(input, { target: { value: "123" } });

    expect(mockOnSearchChanged).toHaveBeenCalledTimes(1);
  });

  it("should call refetch when clicking on refresh icon", () => {
    render(<SearchBar onSearchChanged={mockOnSearchChanged} />);

    const refetchButton = screen.getByLabelText("refetch");
    fireEvent.click(refetchButton);

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should go to new user page when clicking on "Nova Admissão"', () => {
    render(<SearchBar onSearchChanged={mockOnSearchChanged} />);

    const newAdmissionButton = screen.getByText("Nova Admissão");
    fireEvent.click(newAdmissionButton);

    expect(mockPush).toHaveBeenCalledWith(routes.newUser);
  });
});
