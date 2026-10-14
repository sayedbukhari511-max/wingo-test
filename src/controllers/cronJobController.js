import connection from "../config/connectDB.js";
import winGoController from "./winGoController.js";
import k5Controller from "./k5Controller.js";
import k3Controller from "./k3Controller.js";
import trxWingoController, {
  TRX_WINGO_GAME_TYPE_MAP,
} from "./trxWingoController.js";
import cron from "node-cron";
import vipController from "./vipController.js";
import gameController from "./gameController.js";

const GAME_ROUND_CONFIG = {
  1: { trx: TRX_WINGO_GAME_TYPE_MAP.MIN_1, wingo: "wingo" },
  3: { trx: TRX_WINGO_GAME_TYPE_MAP.MIN_3, wingo: "wingo3" },
  5: { trx: TRX_WINGO_GAME_TYPE_MAP.MIN_5, wingo: "wingo5" },
  10: { trx: TRX_WINGO_GAME_TYPE_MAP.MIN_10, wingo: "wingo10" },
};

// Settles the current round and opens the next one for every game of the given duration.
// `emit` pushes the latest results to connected clients when a socket server is available.
const runGameRound = async (minutes, emit = () => {}) => {
  const { trx, wingo } = GAME_ROUND_CONFIG[minutes];

  await trxWingoController.addTrxWingo(minutes);
  await trxWingoController.handlingTrxWingo1P(minutes);
  const [trxWingo] = await connection.execute(
    `SELECT * FROM trx_wingo_game WHERE game = '${trx}' ORDER BY id DESC LIMIT 2`,
    [],
  );
  emit("data-server-trx-wingo", { data: trxWingo });

  await winGoController.addWinGo(minutes);
  await winGoController.handlingWinGo1P(minutes);
  const [winGo] = await connection.execute(
    "SELECT * FROM `wingo` WHERE `game` = ? ORDER BY `id` DESC LIMIT 2 ",
    [wingo],
  );
  emit("data-server", { data: winGo });

  await k5Controller.add5D(minutes);
  await k5Controller.handling5D(minutes);
  const [k5D] = await connection.execute(
    "SELECT * FROM 5d WHERE `game` = ? ORDER BY `id` DESC LIMIT 2 ",
    [minutes],
  );
  emit("data-server-5d", { data: k5D, game: String(minutes) });

  await k3Controller.addK3(minutes);
  await k3Controller.handlingK3(minutes);
  const [k3] = await connection.execute(
    "SELECT * FROM k3 WHERE `game` = ? ORDER BY `id` DESC LIMIT 2 ",
    [minutes],
  );
  emit("data-server-k3", { data: k3, game: String(minutes) });
};

const resetDailyCounters = async () => {
  await connection.execute("UPDATE users SET roses_today = ?", [0]);
  await connection.execute("UPDATE point_list SET money = ?", [0]);
  await connection.execute("UPDATE turn_over SET daily_turn_over = ?", [0]);
};

const cleanOldGames = async () => {
  await gameController.autoCleanOldGames();
};

const releaseVIPLevel = async () => {
  await vipController.releaseVIPLevel();
};

const distributeCommission = async () => {
  await winGoController.distributeCommission();
};

const cronJobGame1p = (io) => {
  const emit = (event, payload) => io.emit(event, payload);

  cron.schedule("*/1 * * * *", () => runGameRound(1, emit));
  cron.schedule("*/3 * * * *", () => runGameRound(3, emit));
  cron.schedule("*/5 * * * *", () => runGameRound(5, emit));
  cron.schedule("*/10 * * * *", () => runGameRound(10, emit));
  cron.schedule("0 1 * * *", resetDailyCounters);
  cron.schedule("0 3 * * *", cleanOldGames);
  cron.schedule("0 2 1 * *", releaseVIPLevel);
  cron.schedule("0 0 * * *", distributeCommission);
};

const cronJobController = {
  cronJobGame1p,
  runGameRound,
  resetDailyCounters,
  cleanOldGames,
  releaseVIPLevel,
  distributeCommission,
};

export default cronJobController;
