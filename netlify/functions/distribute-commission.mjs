import cronJobController from "../../src/controllers/cronJobController.js";

export default async () => {
  await cronJobController.distributeCommission();
};

export const config = {
  schedule: "0 0 * * *",
};
