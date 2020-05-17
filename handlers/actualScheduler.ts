import "../importAlias";
import middy from "@middy/core";
import loadSSM from "@middlewares/loadSSM";
import connectDb from "@middlewares/connectDb";
import { processActualData } from "@services/data";

const processHandler = async (): Promise<void> => {
  await processActualData();
};

export const handler = middy(processHandler).use(loadSSM()).use(connectDb());
