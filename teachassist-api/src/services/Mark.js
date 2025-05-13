export default class Mark {
  constructor(get, total, weight = 1, finished = true) {
    this.get = get;
    this.total = total;
    this.weight = weight;
    this.finished = finished;
  }

  get percentage() {
    if (this.total === 0) return 0;
    return (this.get / this.total) * 100;
  }

  toObject() {
    return {
      get: this.get,
      total: this.total,
      weight: this.weight,
      finished: this.finished,
      percentage: this.percentage
    };
  }
} 