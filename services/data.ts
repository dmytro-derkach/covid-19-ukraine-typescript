import axios from "axios";
import constants from "@constants";
import moment from "moment";
import crypto from "crypto";
import * as csv from "csv-string";
import contentSHA from "@models/contentSHA";
import { pushFileContent } from "@services/github";

const getDataByDate = async (date: string): Promise<Array<any>> => {
  const response = await axios.get(
    constants.API_DATA_LINK.replace("{date}", date)
  );
  return response.data.ukraine;
};

const getCSVData = (data: Array<any>): string => {
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
  let content = csv.stringify([
    "FIPS",
    "Admin2",
    "Province_State",
    "Country_Region",
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
  for (const el of data) {
    if (el.confirmed) {
      content += csv.stringify([
        el.country,
        el.label.en === "Kyiv" ? "Kyiv" : "",
        el.label.en === "Kyiv" ? "Kyivska" : el.label.en,
        "Ukraine",
        currentTime,
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
  }
  return content;
};

export const processActualData = async (): Promise<void> => {
  const currentDate = moment().format(constants.CURRENT_DATE_FORMAT);
  const data = await getDataByDate(currentDate);
  const sha = crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
  if ((await contentSHA.getContentSHA()) !== sha) {
    await pushFileContent(
      getCSVData(data),
      constants.ACTUAL_CASES_PATH,
      constants.ACTUAL_DATA_BRANCH
    );
    await contentSHA.setContentSHA(sha);
  }
};

const enumerateDaysBetweenDates = (
  startDate: string,
  endDate: string
): Array<string> => {
  const dates = [];

  const currDate = moment(startDate, constants.DATE_FORMAT).startOf("day");
  const lastDate = moment(endDate, constants.DATE_FORMAT).startOf("day");

  while (currDate.add(1, "days").diff(lastDate) < 0) {
    dates.push(currDate.clone().format(constants.DATE_FORMAT));
  }

  return dates;
};

export const processAllArchiveData = async (): Promise<void> => {
  const dates = enumerateDaysBetweenDates(
    constants.FIRST_CASES_DATE,
    moment().format(constants.DATE_FORMAT)
  );
  for (const date of dates) {
    const currentDate = moment(date, constants.DATE_FORMAT).format(
      constants.CURRENT_DATE_FORMAT
    );
    const data = await getDataByDate(currentDate);
    await pushFileContent(
      getCSVData(data),
      `${constants.ARCHIVE_CASES_PATH}/${date}.csv`,
      constants.ARCHIVE_DATA_BRANCH
    );
  }
};

export const processArchiveData = async (): Promise<void> => {
  const archiveDate = moment().subtract(1, "days");
  const data = await getDataByDate(
    archiveDate.format(constants.CURRENT_DATE_FORMAT)
  );
  await pushFileContent(
    getCSVData(data),
    `${constants.ARCHIVE_CASES_PATH}/${archiveDate.format(
      constants.DATE_FORMAT
    )}.csv`,
    constants.ARCHIVE_DATA_BRANCH
  );
};
