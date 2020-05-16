import mongoose from "mongoose";
import middy from "@middy/core";
import vars from "@vars";

const log = (shouldLog: boolean, message: string): void | null =>
  shouldLog ? console.log(message) : null;

const closeConnection = (
  shouldClose: boolean,
  shouldLog: boolean
): middy.MiddlewareFunction<any, any> => async (): Promise<void> => {
  if (shouldClose && mongoose.connection.readyState !== 0) {
    log(shouldLog, "=> Closing database connection");
    await mongoose.connection.close();
  }
};

const connectDbMiddleware = ({
  connectionOpts = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: vars.databaseName,
  },
  shouldClose = false,
  shouldLog = true,
}): middy.MiddlewareObject<any, any> => ({
  before: async (): Promise<void> => {
    if (mongoose.connection.readyState === 1) {
      log(shouldLog, "=> Using existing database connection");
    } else {
      log(shouldLog, "=> Using new database connection");
      await mongoose.connect(vars.getDbUrl(), connectionOpts);
    }
  },
  after: closeConnection(shouldClose, shouldLog),
  onError: async (handler, next): Promise<Error> => {
    await closeConnection(shouldClose, shouldLog)(handler, next);
    return handler.error;
  },
});

export default (): middy.MiddlewareObject<any, any> =>
  connectDbMiddleware({
    shouldClose: true,
  });
