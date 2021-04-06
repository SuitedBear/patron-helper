const getPastDate = (months) => {
  let date = new Date();
  // workaround for getting start of the given month
  date = new Date(date.getFullYear(),
    (date.getMonth() - months + 1));
  return date;
};

const getPastDateString = (months) => {
  return getPastDate(months).toISOString().slice(0, 10);
};

const getDateString = () => {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

export {
  getPastDate,
  getPastDateString,
  getDateString
};
