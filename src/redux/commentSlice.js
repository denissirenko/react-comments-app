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
  async (comment, { dispatch }) => {
    const newComment = addLocalComment(comment);
    dispatch(fetchCommentsAsync());
    return newComment;
  }
);

export const deleteCommentAsync = createAsyncThunk(
  "comments/deleteComment",
  async (id, { dispatch }) => {
    deleteLocalComment(id);
    dispatch(fetchCommentsAsync());
    return id;
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

export const { updateDraft } = commentSlice.actions;
export default commentSlice.reducer;
