import { Dispatch } from "redux";
import { setComments } from "../redux/commentSlice";
import { syncLocalComments } from "./localComments";

export const handleSaveState = (
  commentsState: any[],
  commentDraft: string,
  localComments: any[]
) => {
  const stateToSave = {
    items: commentsState,
    draft: commentDraft,
    localComments: localComments,
  };

  const blob = new Blob([JSON.stringify(stateToSave)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "commentsState.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const handleLoadState = async (
  event: React.ChangeEvent<HTMLInputElement>,
  dispatch: Dispatch
) => {
  if (event.target.files) {
    const file = event.target.files[0];
    const text = await file.text();
    const newState = JSON.parse(text);
    dispatch(setComments(newState.items));
    dispatch({ type: "comments/updateDraft", payload: newState.draft });
    syncLocalComments(newState.localComments);
  }
};
