import cronJobController from "../../src/controllers/cronJobController.js";

export default async () => {
  await cronJobController.releaseVIPLevel();
};

export const config = {
  schedule: "0 2 1 * *",
};
