import cronJobController from "../../src/controllers/cronJobController.js";

export default async () => {
  await cronJobController.runGameRound(1);
};

export const config = {
  schedule: "* * * * *",
};
