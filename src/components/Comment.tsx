import { ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export interface CommentProps {
  body: string;
  onDelete: () => void;
}

const Comment = ({ body, onDelete }: CommentProps) => {
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
