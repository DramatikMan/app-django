import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, CssBaseline } from "@material-ui/core";

import App from "./components/App";


const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

ReactDOM.render(
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
    </ThemeProvider>,
    document.getElementById("app")
);