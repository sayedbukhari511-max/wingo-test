import cronJobController from "../../src/controllers/cronJobController.js";

export default async () => {
  await cronJobController.runGameRound(5);
};

export const config = {
  schedule: "*/5 * * * *",
};
