export default class Mark {
  constructor(get, total, weight = 1, finished = true) {
    this.get = parseFloat(get) || 0;
    this.total = parseFloat(total) || 0;
    this.weight = parseFloat(weight) || 1;
    this.finished = finished;
  }

  getPercentage() {
    if (this.total === 0) return 0;
    return (this.get / this.total) * 100;
  }

  getWeightedPercentage() {
    return this.getPercentage() * this.weight;
  }
}