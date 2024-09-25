import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchComments } from "../services/api";
import {
  saveState,
  loadState,
  saveDraft,
  loadDraft,
} from "../utils/localStorage";
import {
  addLocalComment,
  deleteLocalComment,
  getLocalComments,
  syncLocalComments,
} from "../utils/localComments";
import { RootState } from "../redux/store";

interface Comment {
  id: string;
  body: string;
  isLocal: boolean;
}

interface CommentsState {
  items: Comment[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
  draft: string;
}

const initialState: CommentsState = loadState() || {
  items: [],
  status: "idle",
  error: null,
  draft: loadDraft() || "",
};

export const fetchCommentsAsync = createAsyncThunk<Comment[], void>(
  "comments/fetchComments",
  async () => {
    const response = await fetchComments();
    const localComments = getLocalComments();
    return [...localComments, ...response.data.comments];
  }
);

export const addCommentAsync = createAsyncThunk<Comment, Comment>(
  "comments/addComment",
  async (comment, { dispatch, getState }) => {
    const newComment = addLocalComment(comment);
    const currentState = (getState() as RootState).comments;
    const updatedItems = [newComment, ...currentState.items];
    dispatch(commentSlice.actions.setComments(updatedItems));
    return newComment;
  }
);

export const deleteCommentAsync = createAsyncThunk<string, Comment>(
  "comments/deleteComment",
  async (comment, { dispatch, getState }) => {
    if (comment.isLocal) {
      deleteLocalComment(comment.id);
    }

    const currentState = (getState() as RootState).comments;
    const updatedItems = currentState.items.filter(
      (item) => item.id !== comment.id
    );
    dispatch(commentSlice.actions.setComments(updatedItems));
    syncLocalComments(updatedItems.filter((item) => item.isLocal));

    return comment.id;
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    updateDraft: (state, action: PayloadAction<string>) => {
      state.draft = action.payload;
      saveDraft(action.payload);
    },
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.items = action.payload;
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommentsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCommentsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateDraft, setComments } = commentSlice.actions;
export default commentSlice.reducer;
