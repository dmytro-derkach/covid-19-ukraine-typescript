import constants from "@constants";
import vars from "@vars";
import axios from "axios";

const apiRepoLink = `https://api.github.com/repos/${constants.GITHUB_REPOSITORY}`;
const apiContentPath = "/contents/{path}?ref={branch}";

const getContentSHAByPath = async (
  path: string,
  branch = "master"
): Promise<string> => {
  const options = {
    auth: vars.getGithubAuth(),
  };
  const link = `${apiRepoLink}${apiContentPath
    .replace("{branch}", encodeURIComponent(branch))
    .replace("{path}", path)}`;
  const response = await axios.get(link, options);
  return response.data.sha;
};

export const pushFileContent = async (
  content: string,
  path: string,
  branch = "master"
): Promise<void> => {
  const options = {
    auth: vars.getGithubAuth(),
  };
  const buff = Buffer.from(content, "utf-8");
  const encodedContent = buff.toString("base64");
  let contentSHA: string | null = null;
  try {
    contentSHA = await getContentSHAByPath(path, branch);
  } catch {}
  const params: any = {
    message: "Automated update",
    content: encodedContent,
  };
  if (contentSHA) {
    params.sha = contentSHA;
  }
  const link = `${apiRepoLink}${apiContentPath
    .replace("{branch}", encodeURIComponent(branch))
    .replace("{path}", path)}`;
  await axios.put(link, params, options);
};
