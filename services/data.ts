import axios from "axios";
import constants from "@constants";
import moment from "moment";
import crypto from "crypto";
import * as csv from "csv-string";
import contentSHA from "@models/contentSHA";
import { pushFileContent } from "@services/github";

export const processActualData = async (): Promise<void> => {
  const currentDate = moment().format(constants.CURRENT_DATE_FORMAT);
  const response = await axios.get(
    constants.API_DATA_LINK.replace("{date}", currentDate)
  );
  const sha = crypto
    .createHash("sha256")
    .update(JSON.stringify(response.data.ukraine))
    .digest("hex");
  if ((await contentSHA.getContentSHA()) !== sha) {
    let content = csv.stringify([
      "FIPS",
      "Admin2",
      "Province_State",
      "Last_Update",
      "Lat",
      "Long_",
      "Confirmed",
      "Deaths",
      "Recovered",
      "Active",
      "Confirmed_delta",
      "Deaths_delta",
      "Recovered_delta",
      "Active_delta",
    ]);
    for (const el of response.data.ukraine) {
      content += csv.stringify([
        el.country,
        el.label.en === "Kyiv" ? "Kyiv" : "",
        el.label.en === "Kyiv" ? "Kyivska" : el.label.en,
        moment().format("YYYY-MM-DD HH:mm:ss"),
        el.lat,
        el.lng,
        el.confirmed,
        el.deaths,
        el.recovered,
        el.existing,
        el.delta_confirmed,
        el.delta_deaths,
        el.delta_recovered,
        el.delta_existing,
      ]);
    }
    await pushFileContent(
      content,
      constants.ACTUAL_CASES_PATH,
      constants.ACTUAL_DATA_BRANCH
    );
    await contentSHA.setContentSHA(sha);
  }
};
