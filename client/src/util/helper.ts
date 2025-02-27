const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const mobileRegex = /^[6-9]\d{9}$/;

export const validateEmail = (email: string) => emailRegex.test(email);
export const validateMobile = (mobile: string) => mobileRegex.test(mobile);
