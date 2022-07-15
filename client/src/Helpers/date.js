// Date Format
import moment from "moment";
const today = moment();

// Returns Formatted Current Date e.g 2022-06-1
export const formatToCurrentDate = () => {
  return today.format("YYYY-MM-DD");
};

// Returns Formats a Date e.g 1 June 2022
export const dispayDate = (createdDate) => {
  return moment(createdDate).format("ll");
};

// Returns the Time Passed since a Particular Date
export const displayTimePassed = (date) => {
  return moment(date).fromNow();
};
