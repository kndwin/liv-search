const groupJsonByField = (arr, field) =>
  arr.reduce((acc, cur) => {
    const key = cur[field];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(cur);
    return acc;
  }, {});


module.exports = {
  groupJsonByField,
};

