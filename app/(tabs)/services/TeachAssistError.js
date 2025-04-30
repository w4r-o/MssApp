export default class TeachAssistError extends Error {
  constructor(message, type = 'GENERAL_ERROR') {
    super(message);
    this.name = 'TeachAssistError';
    this.type = type;
  }

  static get ERROR_TYPES() {
    return {
      NETWORK_ERROR: 'NETWORK_ERROR',
      AUTH_ERROR: 'AUTH_ERROR',
      PARSE_ERROR: 'PARSE_ERROR',
      GENERAL_ERROR: 'GENERAL_ERROR'
    };
  }
}