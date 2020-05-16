import constants from "@constants";
import ssm from "@middy/ssm";
import middy from "@middy/core";

export default (): middy.MiddlewareObject<any, any> =>
  ssm({
    cache: true,
    paths: {
      APP: constants.SSM_PATH,
    },
  });
