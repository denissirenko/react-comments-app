export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("commentsState", serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("commentsState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

export const saveDraft = (draft) => {
  localStorage.setItem("commentDraft", draft);
};

export const loadDraft = () => {
  return localStorage.getItem("commentDraft") || "";
};
