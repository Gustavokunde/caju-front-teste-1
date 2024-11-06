import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "./";

describe("Modal Component", () => {
  it("should not render modal when isOpen is false", () => {
    render(<Modal isOpen={false} onClose={() => {}} message="Test message" />);
    const modal = screen.queryByTestId("modal");
    expect(modal).toBeNull();
  });

  it("should render modal showing message when isOpen is true", () => {
    render(<Modal isOpen={true} onClose={() => {}} message="Test message" />);
    const modal = screen.getByTestId("modal");
    expect(modal).toBeInTheDocument();
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it('should call onClose when "Fechar" button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} message="Test message" />
    );
    const closeButton = screen.getByText("Fechar");
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call  onConfirm when clicking on "Confirmar"', () => {
    const handleConfirm = jest.fn();
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        message="Test message"
        onConfirm={handleConfirm}
      />
    );
    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('should not render "Confirmar"  button when onConfirm is not being passed', () => {
    render(<Modal isOpen={true} onClose={() => {}} message="Test message" />);
    const confirmButton = screen.queryByText("Confirmar");
    expect(confirmButton).toBeNull();
  });
});
