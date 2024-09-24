import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCommentAsync, updateDraft } from "../redux/commentSlice";
import { TextField, Button, Box } from "@mui/material";

const CommentForm = () => {
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.comments.draft);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (draft.trim()) {
      dispatch(
        addCommentAsync({
          body: draft,
          postId: 1,
          userId: 1,
        })
      );
      dispatch(updateDraft(""));
    }
  };

  const handleChange = (e) => {
    dispatch(updateDraft(e.target.value));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="New Comment"
        value={draft}
        onChange={handleChange}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Add Comment
      </Button>
    </Box>
  );
};

export default CommentForm;
