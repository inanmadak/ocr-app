const apiSecret = '6d01e269-c1eb-459b-9190-b4e7c710d88a';
const apiKey = 'ec3306ea611b4bb5a0d24cd22afc6f07';

export const SCANNER_AUTH_TOKEN = `Bearer ${btoa(apiKey + ':' + apiSecret)}`;

export const SCANNER_RECOGNIZERS = ['MRTD'];

export const GENERAL_ERROR_MESSAGE = 'There was problem scanning the image, make sure you uploaded the back photo of your ID.';

