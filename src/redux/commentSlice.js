import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

export const fetchCommentsAsync = createAsyncThunk(
  "comments/fetchComments",
  async () => {
    const response = await fetchComments();
    const localComments = getLocalComments();
    return [...localComments, ...response.data.comments];
  }
);

export const addCommentAsync = createAsyncThunk(
  "comments/addComment",
  async (comment, { dispatch, getState }) => {
    const newComment = addLocalComment(comment);
    const currentState = getState().comments;
    const updatedItems = [newComment, ...currentState.items];
    dispatch(commentSlice.actions.setComments(updatedItems));
    return newComment;
  }
);

export const deleteCommentAsync = createAsyncThunk(
  "comments/deleteComment",
  async (comment, { dispatch, getState }) => {
    if (comment.isLocal) {
      deleteLocalComment(comment.id);
    }

    const currentState = getState().comments;
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
  initialState: loadState() || {
    items: [],
    status: "idle",
    error: null,
    draft: loadDraft() || "",
  },
  reducers: {
    updateDraft: (state, action) => {
      state.draft = action.payload;
      saveDraft(action.payload);
    },
    setComments: (state, action) => {
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
