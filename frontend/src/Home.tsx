import { Component } from "react";
import { Character } from "./lib/models/KQStream";
import sprites from "./img/sprites";
import "bootstrap/dist/css/bootstrap.css";
import "./Home.css";
import { KQStream, KQStreamOptions } from "./lib/KQStream";
import { debounce } from "lodash";

interface CharacterColumnProps {
  character: Character;
  address: string;
}

const CharacterColumn = (props: CharacterColumnProps) => (
  <div className="col mb-3">
    <a href={`/killboard/player/${props.character}?address=${props.address}`}>
      <img src={sprites.character[props.character]} alt="character" />
    </a>
  </div>
);

interface KillboardLinkProps {
  text: string;
  route: string;
  address: string;
}

const KillboardLink = (props: KillboardLinkProps) => (
  <a href={`/killboard/${props.route}?address=${props.address}`}>
    {props.text}
  </a>
);

interface HomeState {
  address: string;
  connected: boolean;
}

export class Home extends Component<{}, HomeState> {
  stream: KQStream;

  constructor(props: {}) {
    super(props);

    this.state = { address: "kq.local", connected: false };

    const options: KQStreamOptions = {};
    this.stream = new KQStream(options);
    this.stream.on("connectionOpen", () => {
      this.setState({ connected: true });
    });
    this.stream.on("connectionError", () => {
      this.setState({ connected: false });
    });
    this.stream.on("connectionClose", () => {
      this.setState({ connected: false });
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Killer Queen Stats</h1>
        <div
          className={this.state.connected ? "addressSuccess" : "addressFailure"}
        >
          <label htmlFor="address">Cab network address</label>
          <input
            name="address"
            type="text"
            value={this.state.address}
            onChange={async (e) => {
              this.setState({ address: e.target.value, connected: false });
              await this.testConnect();
            }}
          />
          <span>{this.state.connected ? " ✅" : " ❓"}</span>
        </div>
        <div className="roster">
          <div className="row">
            <CharacterColumn
              character={Character.GoldStripes}
              address={this.state.address}
            />
            <CharacterColumn
              character={Character.GoldAbs}
              address={this.state.address}
            />
            <CharacterColumn
              character={Character.GoldQueen}
              address={this.state.address}
            />
            <CharacterColumn
              character={Character.GoldSkulls}
              address={this.state.address}
            />
            <CharacterColumn
              character={Character.GoldChecks}
              address={this.state.address}
            />
          </div>
          <div className="row">
            <CharacterColumn
              character={Character.BlueStripes}
              address={this.state.address}
            />
            <CharacterColumn
              character={Character.BlueAbs}
              address={this.state.address}
            />
            <CharacterColumn
              character={Character.BlueQueen}
              address={this.state.address}
            />
            <CharacterColumn
              character={Character.BlueSkulls}
              address={this.state.address}
            />
            <CharacterColumn
              character={Character.BlueChecks}
              address={this.state.address}
            />
          </div>
        </div>
        <h2>Killboard Layouts</h2>
        <ul>
          <li>
            <KillboardLink
              route="full"
              text="Full"
              address={this.state.address}
            />
          </li>
          <li>
            <KillboardLink
              route="horizontal/blue"
              text="Blue team"
              address={this.state.address}
            />
            <span> (w: 1280, h: 122)</span>
          </li>
          <li>
            <KillboardLink
              route="horizontal/blue/mirror"
              text="Blue team (mirrored)"
              address={this.state.address}
            />
            <span> (w: 1280, h: 122)</span>
          </li>
          <li>
            <KillboardLink
              route="vertical/blue"
              text="Vert Blue team"
              address={this.state.address}
            />
            <span> (w: 500, h: 2500)</span>
          </li>
          <li>
            <KillboardLink
              route="vertical/blue/mirror"
              text="Vert Blue team (mirrored)"
              address={this.state.address}
            />
            <span> (w: 500, h: 2500)</span>
          </li>
          <li>
            <KillboardLink
              route="horizontal/gold"
              text="Gold team"
              address={this.state.address}
            />
            <span> (w: 1280, h: 122)</span>
          </li>
          <li>
            <KillboardLink
              route="horizontal/gold/mirror"
              text="Gold team (mirrored)"
              address={this.state.address}
            />
            <span> (w: 1280, h: 122)</span>
          </li>
          <li>
            <KillboardLink
              route="vertical/gold"
              text="Vert Gold team"
              address={this.state.address}
            />
            <span> (w: 500, h: 2500)</span>
          </li>
          <li>
            <KillboardLink
              route="vertical/gold/mirror"
              text="Vert Gold team (mirrored)"
              address={this.state.address}
            />
            <span> (w: 500, h: 2500)</span>
          </li>
        </ul>
        <div className="alert alert-info" role="alert">
          <a href="/about">What is this, and how do I use it?</a>
        </div>
      </div>
    );
  }

  testConnect = debounce(async () => {
    try {
      await this.stream.connect(`ws://${this.state.address}:12749`);
    } catch (error) {
      console.error("Unable to connect to address", error);
    }
  }, 500);

  async componentDidMount() {
    await this.testConnect();
  }
}
