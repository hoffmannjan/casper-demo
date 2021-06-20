import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"
import ReactDOM from "react-dom"
import { CasperApp } from "./app"

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <CasperApp />
  </React.StrictMode>,
  document.getElementById("root"),
)
