export default class Weight {
  constructor(K = 25, T = 25, C = 25, A = 25) {
    this.K = parseFloat(K);
    this.T = parseFloat(T);
    this.C = parseFloat(C);
    this.A = parseFloat(A);
    this.normalize();
  }

  normalize() {
    const total = this.K + this.T + this.C + this.A;
    if (total !== 100) {
      const factor = 100 / total;
      this.K *= factor;
      this.T *= factor;
      this.C *= factor;
      this.A *= factor;
    }
  }

  toObject() {
    return {
      K: this.K,
      T: this.T,
      C: this.C,
      A: this.A
    };
  }
}