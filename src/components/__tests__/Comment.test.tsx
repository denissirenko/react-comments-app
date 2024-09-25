import { render, screen, fireEvent } from "@testing-library/react";
import Comment from "../Comment";
import "@testing-library/jest-dom";

describe("Comment component", () => {
  const mockComment = "Test comment";

  const mockOnDelete = vi.fn();

  it("should render comment body", () => {
    render(<Comment body={mockComment} onDelete={mockOnDelete} />);

    expect(screen.getByText("Test comment")).toBeInTheDocument();
  });

  it("should call onDelete when delete button is clicked", () => {
    render(<Comment body={mockComment} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByLabelText("delete");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
