import { Character } from "../../lib/models/KQStream";

import gold_queen from "./gold_queen.png";
import gold_stripes from "./gold_stripes.png";
import gold_abs from "./gold_abs.png";
import gold_skulls from "./gold_skulls.png";
import gold_checks from "./gold_checks.png";
import blue_queen from "./blue_queen.png";
import blue_stripes from "./blue_stripes.png";
import blue_abs from "./blue_abs.png";
import blue_skulls from "./blue_skulls.png";
import blue_checks from "./blue_checks.png";
import snail from "./snail.png";
import crown from "./crown.png";

const gold = {
  queen: gold_queen,
  stripes: gold_stripes,
  abs: gold_abs,
  skulls: gold_skulls,
  checks: gold_checks,
};
const blue = {
  queen: blue_queen,
  stripes: blue_stripes,
  abs: blue_abs,
  skulls: blue_skulls,
  checks: blue_checks,
};
const character = {
  [Character.GoldQueen]: gold.queen,
  [Character.GoldStripes]: gold.stripes,
  [Character.GoldAbs]: gold.abs,
  [Character.GoldSkulls]: gold.skulls,
  [Character.GoldChecks]: gold.checks,
  [Character.BlueQueen]: blue.queen,
  [Character.BlueStripes]: blue.stripes,
  [Character.BlueAbs]: blue.abs,
  [Character.BlueSkulls]: blue.skulls,
  [Character.BlueChecks]: blue.checks,
};

const sprites = {
  gold: gold,
  blue: blue,
  character: character,
  snail: snail,
  crown: crown,
};

export default sprites;
