import cronJobController from "../../src/controllers/cronJobController.js";

export default async () => {
  await cronJobController.runGameRound(10);
};

export const config = {
  schedule: "*/10 * * * *",
};
