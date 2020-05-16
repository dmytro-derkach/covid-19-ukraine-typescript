import "../importAlias";
import middy from "@middy/core";
import loadSSM from "@middlewares/loadSSM";
import connectDb from "@middlewares/connectDb";

const processHandler = async (): Promise<void> => {
  console.log("test");
};

export const handler = middy(processHandler).use(loadSSM()).use(connectDb());
