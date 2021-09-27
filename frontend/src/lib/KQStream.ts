/**
 * Many thanks to Tony for his awesome work on kqdeathmap:
 * https://github.com/arantius/kqdeathmap
 */

import * as _ from "lodash";
import { ProtectedEventEmitter } from "eventemitter-ts";
import * as stream from "stream";
import * as parsers from "./parsers";
import {
  PlayerNames,
  PlayerKill,
  BlessMaiden,
  ReserveMaiden,
  UnreserveMaiden,
  UseMaiden,
  Glance,
  CarryFood,
  GameStart,
  GameEnd,
  Victory,
  Spawn,
  GetOnSnail,
  GetOffSnail,
  SnailEat,
  SnailEscape,
  BerryDeposit,
  BerryKickIn,
} from "./models/KQStream";

export interface KQStreamOptions {
  log?: stream.Writable;
}

export type GameEvents = {
  playernames: PlayerNames;
  playerKill: PlayerKill;
  // New events from beta 2018-08-21
  blessMaiden: BlessMaiden;
  reserveMaiden: ReserveMaiden;
  unreserveMaiden: UnreserveMaiden;
  useMaiden: UseMaiden;
  glance: Glance;
  carryFood: CarryFood;
  gamestart: GameStart;
  gameend: GameEnd;
  victory: Victory;
  spawn: Spawn;
  getOnSnail: GetOnSnail;
  getOffSnail: GetOffSnail;
  snailEat: SnailEat;
  snailEscape: SnailEscape;
  berryDeposit: BerryDeposit;
  berryKickIn: BerryKickIn;
};

type ConnectionOpen = {};

type ConnectionClose = {
  code: number;
  desc: string;
};

type ConnectionError = {
  err: Error;
  connected: boolean;
};

type StreamEvents = {
  connectionOpen: ConnectionOpen;
  connectionClose: ConnectionClose;
  connectionError: ConnectionError;
};

type Events = GameEvents & StreamEvents;

export class KQStream extends ProtectedEventEmitter<Events> {
  private options: KQStreamOptions;
  private socket?: WebSocket;

  /**
   * Parses a Killer Queen websocket message.
   *
   * @param message The message to parse
   * @returns The type (key) and data (value) of the message,
   *          or `undefined` if unable to parse the message.
   */
  static parse(message: string) {
    // Websocket messages use format `![k[${key}],v[${value}]]!`
    // Replace `${key}` with the key, and `${value}` with the value
    const dataArray = message.match(/!\[k\[(.+)\],v\[(.*)?\]\]!/);
    if (dataArray === null) {
      return;
    }
    const parsedMessage = {
      key: KQStream.normalizeKey(dataArray[1]),
      value: KQStream.normalizeValues(dataArray[2]),
    };

    return parsedMessage;
  }

  static normalizeKey(key: string) {
    // Replace non letters with empty
    return key.replace(/[^a-z]/gi, "").trim();
  }

  static normalizeValues(values: string) {
    const valuesList = values.split(",");
    const normalizedValuesList = valuesList.map((value) => {
      // If it's a number, no processing necessary
      if (!Number.isNaN(Number(value))) {
        return value;
      }

      /**
       * Normalize team names and convert to camelcase
       * Different events use different names for teams:
       *
       * - `blessMaiden` uses `"Red"` and `"Blue"`
       * - `victory` uses `"Gold"` and `"Blue"`
       * We just want gold and blue.
       */
      value = value.replace(/^Red$/, "Gold");
      value = _.camelCase(value);
      return value;
    });
    return normalizedValuesList;
  }

  constructor(options?: KQStreamOptions) {
    super();
    if (options === undefined) {
      options = {};
    }
    this.options = options;
  }

  connect(host: string) {
    this.socket = new WebSocket(host);
    this.socket.onmessage = (message) => {
      if (message !== undefined && message.data !== undefined) {
        console.log("message", message.data);
        this.processMessage(message.data);
      }
    };

    this.socket.onerror = (e) => {
      console.log("got error", e);
    };

    this.socket.onclose = (e) => {
      console.log("got close", e);
    };

    this.socket.onopen = (e) => {
      this.protectedEmit("connectionOpen", {});
      this.sendMessage("connect", {
        name: "kqstats-obs",
        isGameMachine: false,
      });
    };
  }

  private processMessage(message: string): void {
    if (this.options.log !== undefined) {
      this.options.log.write(`${Date.now().toString()},${message}\n`);
    }
    const parsedMessage = KQStream.parse(message);
    if (!parsedMessage) {
      console.warn("Could not parse message", message);
      return;
    }
    switch (parsedMessage.key) {
      case "alive":
        this.sendMessage("im alive", 1);
        break;
      case "playernames":
        const playernames = parsers.playernames(parsedMessage.value);
        this.protectedEmit("playernames", playernames);
        break;
      case "playerKill":
        const playerKill = parsers.playerKill(parsedMessage.value);
        this.protectedEmit("playerKill", playerKill);
        break;
      // New events from beta 2018-08-21
      case "blessMaiden":
        const blessMaiden = parsers.blessMaiden(parsedMessage.value);
        this.protectedEmit("blessMaiden", blessMaiden);
        break;
      case "reserveMaiden":
        const reserveMaiden = parsers.reserveMaiden(parsedMessage.value);
        this.protectedEmit("reserveMaiden", reserveMaiden);
        break;
      case "unreserveMaiden":
        const unreserveMaiden = parsers.unreserveMaiden(parsedMessage.value);
        this.protectedEmit("unreserveMaiden", unreserveMaiden);
        break;
      case "useMaiden":
        const useMaiden = parsers.useMaiden(parsedMessage.value);
        this.protectedEmit("useMaiden", useMaiden);
        break;
      case "glance":
        const glance = parsers.glance(parsedMessage.value);
        this.protectedEmit("glance", glance);
        break;
      case "carryFood":
        const carryFood = parsers.carryFood(parsedMessage.value);
        this.protectedEmit("carryFood", carryFood);
        break;
      case "gamestart":
        const gameStart = parsers.gameStart(parsedMessage.value);
        this.protectedEmit("gamestart", gameStart);
        break;
      case "gameend":
        const gameEnd = parsers.gameEnd(parsedMessage.value);
        this.protectedEmit("gameend", gameEnd);
        break;
      case "victory":
        const victory = parsers.victory(parsedMessage.value);
        this.protectedEmit("victory", victory);
        break;
      case "spawn":
        const spawn = parsers.spawn(parsedMessage.value);
        this.protectedEmit("spawn", spawn);
        break;
      case "getOnSnail":
        const getOnSnail = parsers.getOnSnail(parsedMessage.value);
        this.protectedEmit("getOnSnail", getOnSnail);
        break;
      case "getOffSnail":
        const getOffSnail = parsers.getOffSnail(parsedMessage.value);
        this.protectedEmit("getOffSnail", getOffSnail);
        break;
      case "snailEat":
        const snailEat = parsers.snailEat(parsedMessage.value);
        this.protectedEmit("snailEat", snailEat);
        break;
      case "snailEscape":
        const snailEscape = parsers.snailEscape(parsedMessage.value);
        this.protectedEmit("snailEscape", snailEscape);
        break;
      case "berryDeposit":
        const berryDeposit = parsers.berryDeposit(parsedMessage.value);
        this.protectedEmit("berryDeposit", berryDeposit);
        break;
      case "berryKickIn":
        const berryKickIn = parsers.berryKickIn(parsedMessage.value);
        this.protectedEmit("berryKickIn", berryKickIn);
        break;
      default:
        break;
    }
  }

  private sendMessage(key: string, value: any): void {
    if (this.socket !== undefined) {
      const valueString = JSON.stringify(value);
      const message = `![k[${key}],v[${valueString}]]!`;
      console.log("sending", message);
      this.socket.send(message);
    }
  }
}
