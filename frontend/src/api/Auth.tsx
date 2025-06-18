import api from '.';
import type { User } from '../types/Entities';

export const loginEP = (
  email: string,
  password: string,
): Promise<{ token: string; user: User }> => {
  return api.post('/auth/login', { email, password });
};

export const registerEP = (name: string, email: string): Promise<User> => {
  return api.post('/auth/register', { name, email });
};

export const changePasswordEP = (
  password: string,
): Promise<{ message: string }> => {
  return api.post('/auth/change-password', { password });
};

export const resetPasswordEP = (
  email: string,
): Promise<{ message: string }> => {
  return api.post('/auth/reset-password', { email });
};
