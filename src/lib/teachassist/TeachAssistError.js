class TeachAssistError extends Error {
  constructor(message) {
    super(message);
    this.name = "TeachAssistError";
  }
}

module.exports = TeachAssistError; 