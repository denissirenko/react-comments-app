import { useSelector, useDispatch } from "react-redux";
import { addCommentAsync, updateDraft } from "../redux/commentSlice";
import { TextField, Button, Box } from "@mui/material";
import { RootState, AppDispatch } from "../redux/store";
import { ChangeEvent, FormEvent } from "react";

const CommentForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.comments.draft);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (draft.trim()) {
      dispatch(
        addCommentAsync({
          id: Date.now().toString(),
          body: draft,
          isLocal: true,
        })
      );
      dispatch(updateDraft(""));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!draft.trim()}
      >
        Add Comment
      </Button>
    </Box>
  );
};

export default CommentForm;
