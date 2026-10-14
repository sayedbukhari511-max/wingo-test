import cronJobController from "../../src/controllers/cronJobController.js";

export default async () => {
  await cronJobController.runGameRound(3);
};

export const config = {
  schedule: "*/3 * * * *",
};
