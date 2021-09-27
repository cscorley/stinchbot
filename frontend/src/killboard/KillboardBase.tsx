import { GameStats, GameStatsType, KQStat } from "../lib/GameStats";
import * as React from "react";
import sprites from "../img/sprites";
import { KQStream, KQStreamOptions } from "../lib/KQStream";

export interface KillboardBaseProps {
  address: string;
}

export abstract class KillboardBase<
  T extends KillboardBaseProps
> extends React.Component<T, GameStatsType> {
  stream: KQStream;
  gameStats: GameStats;

  static getCrowns(n: number) {
    const crown = <img className="crown" src={sprites.crown} alt="crown" />;
    const html: JSX.Element[] = [];
    for (let i = 0; i < n; i++) {
      html.push(crown);
    }
    return html;
  }

  async connect(stream: KQStream, address: string) {
    console.log(`Connecting to ${address}...`);
    try {
      await stream.connect(address);
    } catch (error) {
      console.log(`Connection failed, waiting 5 seconds...`, error);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve(this.connect(stream, address));
        }, 5 * 1000);
      });
    }
    console.log("Connected!");
  }

  constructor(props: T) {
    super(props);

    const options: KQStreamOptions = {};
    this.stream = new KQStream(options);
    this.gameStats = new GameStats(this.stream);
    this.gameStats.start();
    this.state = GameStats.defaultGameStats;

    this.gameStats.on("change", (data: KQStat) => {
      this.setState((prevState) => {
        let characterStats = prevState[data.character];
        if (characterStats === undefined) {
          characterStats = GameStats.defaultCharacterStats;
        }
        characterStats[data.statistic] = data.value;
        return {
          [data.character]: characterStats,
        };
      });
    });
  }

  async componentDidMount() {
    await this.connect(this.stream, `ws://${this.props.address}:12749`);
  }
}
