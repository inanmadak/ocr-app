const apiSecret = 'fb3dedd9-d831-4362-afe3-1ad6066e07c7';
const apiKey = '197d408f3ac34985a7fb7e7926c56f9d';

export const SCANNER_AUTH_TOKEN = `Bearer ${btoa(apiKey + ':' + apiSecret)}`;

export const SCANNER_RECOGNIZERS = ['MRTD'];

export const GENERAL_ERROR_MESSAGE = 'There was problem scanning the image, make sure you uploaded the back photo of your ID.';

