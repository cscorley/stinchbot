import { Route, RouteComponentProps, Switch } from "react-router";
import * as React from "react";
import KillboardFull from "./KillboardFull";
import KillboardHorizontal from "./KillboardHorizontal";
import KillboardVertical from "./KillboardVertical";
import KillboardPlayer from "./KillboardPlayer";

import "bootstrap/dist/css/bootstrap.css";
import "./Killboard.css";
import { Character } from "../lib/models/KQStream";

class Killboard extends React.Component<RouteComponentProps<{}>> {
  render() {
    const query = new URLSearchParams(this.props.location.search);
    const queryAddress = query.get("address");
    let address = "kq.local";
    if (queryAddress) {
      address = queryAddress;
    }

    return (
      <Switch>
        <Route
          exact={true}
          path={`${this.props.match.path}/full`}
          render={(props) => <KillboardFull address={address} />}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/horizontal/blue`}
          render={(props) => (
            <KillboardHorizontal address={address} team="blue" mirror={false} />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/horizontal/gold`}
          render={(props) => (
            <KillboardHorizontal address={address} team="gold" mirror={false} />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/horizontal/blue/mirror`}
          render={(props) => (
            <KillboardHorizontal address={address} team="blue" mirror={true} />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/horizontal/gold/mirror`}
          render={(props) => (
            <KillboardHorizontal address={address} team="gold" mirror={true} />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/vertical/blue`}
          render={(props) => (
            <KillboardVertical address={address} team="blue" />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/vertical/gold`}
          render={(props) => (
            <KillboardVertical address={address} team="gold" />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/vertical/blue/mirror`}
          render={(props) => (
            <KillboardVertical address={address} team="blue" mirror={true} />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/vertical/gold/mirror`}
          render={(props) => (
            <KillboardVertical address={address} team="gold" mirror={true} />
          )}
        />
        <Route
          exact={true}
          path={`${this.props.match.path}/player/:character`}
          render={(props) => (
            <KillboardPlayer
              address={address}
              character={Number(props.match.params.character) as Character}
            />
          )}
        />
      </Switch>
    );
  }
}

export default Killboard;
