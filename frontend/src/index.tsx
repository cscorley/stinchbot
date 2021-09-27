import { BrowserRouter, Route, Switch } from "react-router-dom";
import { render } from "react-dom";
import { Home } from "./Home";
import Killboard from "./killboard/Killboard";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import { About } from "./About";

render(
  <BrowserRouter>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route exact={true} path="/about" component={About} />
      <Route path="/killboard" component={Killboard} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);
