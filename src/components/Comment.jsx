import React from "react";
import { ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Comment = ({ comment, onDelete }) => {
  const { id, isLocal, body } = comment;
  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={() => onDelete()}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemText primary={body} />
    </ListItem>
  );
};

export default Comment;
