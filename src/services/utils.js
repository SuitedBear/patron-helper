const getPastDate = (months) => {
  let date = new Date();
  // workaround for getting start of the given month
  date = new Date(date.getFullYear(),
    (date.getMonth() - months + 1));
  return date;
};

export {
  getPastDate
};
