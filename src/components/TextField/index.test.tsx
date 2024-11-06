import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import TextField from "./";

describe("TextField Component", () => {
  it("should show label when being passed", () => {
    render(<TextField label="Nome" id="name" />);

    const label = screen.getByText("Nome");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "name");
  });

  it("should show error message when being passed ", () => {
    render(<TextField error="Erro no campo" />);

    const errorMessage = screen.getByText("Erro no campo");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveStyle("color: red");
  });

  it("should update input value when typing ", () => {
    render(<TextField label="Nome" id="name" />);

    const input = screen.getByLabelText("Nome");
    fireEvent.change(input, { target: { value: "John Doe" } });
    expect(input).toHaveValue("John Doe");
  });

  it("should not show any error if it ia not being passed ", () => {
    render(<TextField />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(screen.queryByText("Erro")).not.toBeInTheDocument();
  });
});
