import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getLocalComments } from "../utils/localComments";
import { RootState } from "../redux/store";
import { handleSaveState, handleLoadState } from "../utils/SharingStateUtils";

const StateTransfer = () => {
  const dispatch = useDispatch();

  const commentDraft = useSelector((state: RootState) => state.comments.draft);
  const commentsState = useSelector((state: RootState) => state.comments.items);
  const localComments = getLocalComments();

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Sharing Application State
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          handleSaveState(commentsState, commentDraft, localComments)
        }
        sx={{ mr: 2 }}
      >
        Save State
      </Button>
      <input
        accept=".json"
        style={{ display: "none" }}
        id="upload-file"
        type="file"
        onChange={(event) => handleLoadState(event, dispatch)}
      />
      <label htmlFor="upload-file">
        <Button variant="contained" color="secondary" component="span">
          Load state
        </Button>
      </label>
    </>
  );
};

export default StateTransfer;
