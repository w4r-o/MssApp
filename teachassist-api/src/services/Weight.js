export default class Weight {
  constructor(knowledge, thinking, communication, application) {
    this.K = knowledge;
    this.T = thinking;
    this.C = communication;
    this.A = application;
  }

  toObject() {
    return {
      K: this.K,
      T: this.T,
      C: this.C,
      A: this.A
    };
  }

  static fromObject(obj) {
    return new Weight(
      obj.K || 25,
      obj.T || 25,
      obj.C || 25,
      obj.A || 25
    );
  }
} 