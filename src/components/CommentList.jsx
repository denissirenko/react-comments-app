import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCommentsAsync, deleteCommentAsync } from "../redux/commentSlice";
import Comment from "./Comment";
import { List, CircularProgress } from "@mui/material";

const CommentList = () => {
  const dispatch = useDispatch();
  const {
    items: comments,
    status,
    error,
  } = useSelector((state) => state.comments);
  console.log("commmmmm", comments);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCommentsAsync());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteCommentAsync(id));
  };

  if (status === "loading") {
    return <CircularProgress />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <List>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          comment={comment.body}
          onDelete={handleDelete}
        />
      ))}
    </List>
  );
};

export default CommentList;
