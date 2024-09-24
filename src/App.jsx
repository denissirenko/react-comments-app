import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import CommentList from "./components/CommentList";
import CommentForm from "./components/CommentForm";
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Provider store={store}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Comments App
        </Typography>
        <CommentForm />
        <CommentList />
      </Container>
    </Provider>
  );
}

export default App;
