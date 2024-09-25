import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CommentForm from "../CommentForm";
import * as commentSlice from "../../redux/commentSlice";
import "@testing-library/jest-dom";

interface Comment {
  id: string;
  body: string;
  isLocal: boolean;
}

interface CommentsState {
  draft: string;
  items: Comment[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

vi.spyOn(commentSlice, "addCommentAsync");
vi.spyOn(commentSlice, "updateDraft");

const createMockStore = (initialState: CommentsState) => {
  return configureStore({
    reducer: {
      comments: (state: CommentsState = initialState, action): CommentsState =>
        state,
    },
  });
};

describe("CommentForm component", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the comment form with a text field and button", () => {
    store = createMockStore({
      draft: "",
      items: [],
      status: "idle",
      error: null,
    });

    render(
      <Provider store={store}>
        <CommentForm />
      </Provider>
    );

    expect(screen.getByLabelText(/new comment/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add comment/i })
    ).toBeInTheDocument();
  });

  it("should enable button when draft is not empty", () => {
    store = createMockStore({
      draft: "Test comment",
      items: [],
      status: "idle",
      error: null,
    });

    render(
      <Provider store={store}>
        <CommentForm />
      </Provider>
    );

    const button = screen.getByRole("button", { name: /add comment/i });
    expect(button).not.toBeDisabled();
  });

  it("should dispatch updateDraft when input value changes", () => {
    store = createMockStore({
      draft: "",
      items: [],
      status: "idle",
      error: null,
    });

    render(
      <Provider store={store}>
        <CommentForm />
      </Provider>
    );

    const input = screen.getByLabelText(/new comment/i);
    fireEvent.change(input, { target: { value: "Test comment" } });

    expect(commentSlice.updateDraft).toHaveBeenCalledWith("Test comment");
  });

  it("should dispatch addCommentAsync and updateDraft on form submission", () => {
    store = createMockStore({
      draft: "Test comment",
      items: [],
      status: "idle",
      error: null,
    });

    render(
      <Provider store={store}>
        <CommentForm />
      </Provider>
    );

    const button = screen.getByRole("button", { name: /add comment/i });
    fireEvent.click(button);

    expect(commentSlice.addCommentAsync).toHaveBeenCalledWith({
      id: expect.any(String),
      body: "Test comment",
      isLocal: true,
    });

    expect(commentSlice.updateDraft).toHaveBeenCalledWith("");
  });

  it("should disable button when draft is empty", () => {
    store = createMockStore({
      draft: "",
      items: [],
      status: "idle",
      error: null,
    });

    render(
      <Provider store={store}>
        <CommentForm />
      </Provider>
    );

    const button = screen.getByRole("button", { name: /add comment/i });
    expect(button).toBeDisabled();
  });
});
