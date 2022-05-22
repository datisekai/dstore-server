const convert = (rows) => {
  return Object.values(JSON.parse(JSON.stringify(rows)));
};

export default convert;
