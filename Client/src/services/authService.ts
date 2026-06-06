import api from './api';

export const authService = {
  // 1. הרשמה - שומרת טוקן ונכנסת ישר
  register: async (name: string, email: string, password: string, role: string = 'User', adminCode?: string) => {
    const response = await api.post('/users/register', { name, email, password, role, adminCode });
    return response.data;
  },

  // 2. התחברות - ישירה עם טוקן (ללא אימות מייל)
  login: async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await api.post('/users/login', { email, password });
    
    // Save token immediately for login (no verification step)
    const dataObj = response.data?.data;
    if (dataObj && dataObj.token) {
        const storage = rememberMe ? localStorage : sessionStorage;
        const storageType = rememberMe ? 'localStorage' : 'sessionStorage';
        
        console.log(`💾 Login - Saving token to ${storageType}`)
        
        storage.setItem('token', dataObj.token);
        storage.setItem('user', JSON.stringify(dataObj.user));
        
        // Clear the other storage to avoid conflicts
        const otherStorage = rememberMe ? sessionStorage : localStorage;
        otherStorage.removeItem('token');
        otherStorage.removeItem('user');
    }
    
    return response.data;
  },

  // 3. אימות קוד - רק עבור הרשמה
  verifyCode: async (email: string, code: string, rememberMe: boolean = false) => {
    console.log('💾 Registration verification - Remember Me:', rememberMe)
    
    const response = await api.post('/users/verify-code', { email, code });
    
    const dataObj = response.data?.data;
    if (dataObj && dataObj.token) {
        const storage = rememberMe ? localStorage : sessionStorage;
        const storageType = rememberMe ? 'localStorage' : 'sessionStorage';
        
        console.log(`💾 Registration - Saving token to ${storageType}`)
        
        storage.setItem('token', dataObj.token);
        storage.setItem('user', JSON.stringify(dataObj.user));
        
        // Clear the other storage to avoid conflicts
        const otherStorage = rememberMe ? sessionStorage : localStorage;
        otherStorage.removeItem('token');
        otherStorage.removeItem('user');
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    const user = localUser || sessionUser;
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
};