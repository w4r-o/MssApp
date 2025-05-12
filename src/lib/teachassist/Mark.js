const sTypes = ["KU", "TI", "COMM", "APP", "OTHER"];
const nTypes = {
  "#fff1aa": 0,
  "#c0eaf4": 1,
  "#affaff": 2,
  "#ffd49d": 3,
  "#dedede": 4
};

class Mark {
  constructor(name, earned, total, weight) {
    this.name = name;
    this.earned = earned;
    this.total = total;
    this.weight = weight;
  }

  static getStringType(type) {
    return sTypes[type];
  }

  static getNumericType(color) {
    return nTypes[color];
  }
}

module.exports = Mark; 