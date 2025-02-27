export const APP_PORT = 8080;
export const ENVIRONMENT = process.env.APP_ENV || 'dev';
export const IS_PRODUCTION = ENVIRONMENT === 'production';
export const DB_URI = (): string => process.env.DB_URI || '';
export const DEFAULT_MAIL =
 ():string => process.env.DEFAULT_MAIL || 'manavithorve@gmail.com';
export const EMAIL_USER =
 ():string => process.env.EMAIL_USER || 'tezzjob.services@gmail.com';
export const EMAIL_PASS =
 ():string => process.env.EMAIL_PASS || 'TezzJob@12345';