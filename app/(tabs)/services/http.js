import TeachAssistError from './TeachAssistError';

export const BASE_URL = 'https://ta.yrdsb.ca/live/';

const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive'
};

export async function request(path, options = {}) {
  try {
    const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new TeachAssistError(
        `HTTP error! status: ${response.status}`,
        TeachAssistError.ERROR_TYPES.NETWORK_ERROR
      );
    }

    return response;
  } catch (error) {
    if (error instanceof TeachAssistError) {
      throw error;
    }
    throw new TeachAssistError(
      `Network request failed: ${error.message}`,
      TeachAssistError.ERROR_TYPES.NETWORK_ERROR
    );
  }
}