import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCommentsAsync, deleteCommentAsync } from "../redux/commentSlice";
import Comment from "./Comment";
import { List, CircularProgress, Typography } from "@mui/material";

const CommentList = () => {
  const dispatch = useDispatch();
  const {
    items: comments,
    status,
    error,
  } = useSelector((state) => state.comments);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCommentsAsync());
    }
  }, [status, dispatch]);

  const handleDelete = (comment) => {
    dispatch(deleteCommentAsync(comment));
  };

  if (status === "loading") {
    return <CircularProgress />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (comments.length === 0) {
    return (
      <Typography color="info" my="20px">
        No comments yet. Be the first to share your thoughts!
      </Typography>
    );
  }

  return (
    <List>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onDelete={() => handleDelete(comment)}
        />
      ))}
    </List>
  );
};

export default CommentList;
