export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    return password.length >= 6 && password.length <= 20;
  };
  
  export const validateName = (name: string): boolean => {
    return name.length >= 3 && name.length <= 50;
  };

  export function validateEmailLength(email: string): boolean {
    const maxLength = 50; 
    return email.length <= maxLength;
  }
  