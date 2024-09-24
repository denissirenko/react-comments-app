let localComments = JSON.parse(localStorage.getItem("localComments")) || [];

export const addLocalComment = (comment) => {
  const newComment = {
    id: Date.now(),
    ...comment,
    createdAt: new Date().toISOString(),
  };
  localComments = [newComment, ...localComments];
  localStorage.setItem("localComments", JSON.stringify(localComments));
  return newComment;
};

export const deleteLocalComment = (id) => {
  localComments = localComments.filter((comment) => comment.id !== id);
  localStorage.setItem("localComments", JSON.stringify(localComments));
};

export const getLocalComments = () => {
  return localComments;
};
