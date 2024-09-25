import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CommentList from "../CommentList";
import * as commentSlice from "../../redux/commentSlice";
import "@testing-library/jest-dom";

interface Comment {
  id: string;
  body: string;
  isLocal: boolean;
}

interface CommentsState {
  items: Comment[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

vi.spyOn(commentSlice, "fetchCommentsAsync");
vi.spyOn(commentSlice, "deleteCommentAsync");

// Create a mock store with proper typing
const createMockStore = (initialState: CommentsState) => {
  return configureStore({
    reducer: {
      comments: (state: CommentsState = initialState, action): CommentsState =>
        state,
    },
  });
};

describe("CommentList component", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state", () => {
    store = createMockStore({ status: "loading", items: [], error: null });
    render(
      <Provider store={store}>
        <CommentList />
      </Provider>
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should show error state", () => {
    store = createMockStore({
      status: "failed",
      items: [],
      error: "Error message",
    });
    render(
      <Provider store={store}>
        <CommentList />
      </Provider>
    );
    expect(screen.getByText(/Error: Error message/i)).toBeInTheDocument();
  });

  it("should show message when no comments", () => {
    store = createMockStore({ status: "succeeded", items: [], error: null });
    render(
      <Provider store={store}>
        <CommentList />
      </Provider>
    );
    expect(screen.getByText(/No comments yet/i)).toBeInTheDocument();
  });

  it("should render comments and handle delete", () => {
    const mockComments: Comment[] = [
      { id: "1", body: "Comment 1", isLocal: false },
      { id: "2", body: "Comment 2", isLocal: true },
    ];
    store = createMockStore({
      status: "succeeded",
      items: mockComments,
      error: null,
    });

    render(
      <Provider store={store}>
        <CommentList />
      </Provider>
    );

    expect(screen.getByText("Comment 1")).toBeInTheDocument();
    expect(screen.getByText("Comment 2")).toBeInTheDocument();

    const deleteButtons = screen.getAllByLabelText("delete");
    fireEvent.click(deleteButtons[0]);

    expect(commentSlice.deleteCommentAsync).toHaveBeenCalledTimes(1);
    expect(commentSlice.deleteCommentAsync).toHaveBeenCalledWith(
      mockComments[0]
    );
  });

  it("should dispatch fetchCommentsAsync when status is idle", () => {
    store = createMockStore({ status: "idle", items: [], error: null });
    render(
      <Provider store={store}>
        <CommentList />
      </Provider>
    );
    expect(commentSlice.fetchCommentsAsync).toHaveBeenCalledTimes(1);
  });
});
