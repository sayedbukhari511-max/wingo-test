import cronJobController from "../../src/controllers/cronJobController.js";

export default async () => {
  await cronJobController.cleanOldGames();
};

export const config = {
  schedule: "0 3 * * *",
};
