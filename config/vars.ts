import { AxiosBasicCredentials } from "axios";

const getDbUrl = (): string => String(process.env.APP_MONGODB_URI);
const getGithubAuth = (): AxiosBasicCredentials =>
  JSON.parse(String(process.env.APP_GITHUB_AUTH));

export default {
  getDbUrl,
  getGithubAuth,
  databaseName: process.env.DATABASE_NAME,
  region: process.env.REGION,
};
