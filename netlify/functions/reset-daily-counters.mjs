import cronJobController from "../../src/controllers/cronJobController.js";

export default async () => {
  await cronJobController.resetDailyCounters();
};

export const config = {
  schedule: "0 1 * * *",
};
