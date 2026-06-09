import api from './api';

// ✅ Single source of truth - always sessionStorage
// For "rememberMe", we store a flag and re-hydrate on app load instead
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const REMEMBER_ME_KEY = 'rememberMe';

export const authService = {
  // 1. Register
  register: async (
    name: string,
    email: string,
    password: string,
    role: string = 'User',
    adminCode?: string
  ) => {
    const response = await api.post('/users/register', {
      name, email, password, role, adminCode
    });
    return response.data;
  },

  // 2. Login
  login: async (email: string, password: string, rememberMe: boolean = false) => {
    // 🌟 שינוי קריטי 1: מוחקים את כל נתוני המשתמש הקודם *לפני* ששולחים את הבקשה לשרת!
    // זה מונע מהטוקן הישן להישאר ב-localStorage ולרמות את האפליקציה אם הלוגין החדש ייכשל.
    authService.clearStorage();
    localStorage.removeItem(REMEMBER_ME_KEY);

    try {
      const response = await api.post('/users/login', { email, password });

      const dataObj = response.data?.data;
      console.log('🔑 login response dataObj:', dataObj)
      
      if (dataObj?.token) {
        // ✅ ALWAYS save to sessionStorage (safe for tab/session scope)
        sessionStorage.setItem(TOKEN_KEY, dataObj.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(dataObj.user));

        // ✅ If rememberMe, also persist to localStorage for re-hydration on next visit
        if (rememberMe) {
          localStorage.setItem(REMEMBER_ME_KEY, 'true');
          localStorage.setItem(TOKEN_KEY, dataObj.token);
          localStorage.setItem(USER_KEY, JSON.stringify(dataObj.user));
        }

        console.log('💾 Login - Token saved to sessionStorage');
      }

      return response.data;
    } catch (error: any) {
      // 🌟 שינוי קריטי 2: אם השרת מחזיר 401 או כל שגיאה אחרת, אנחנו זורקים אותה הלאה
      // כדי שקומפוננטת ה-AuthPage (המסך של הלוגין) תדע שהלוגין נכשל ותציג הודעת שגיאה אדומה
      console.error('❌ Login API Error:', error.response?.data || error.message);
      throw error; 
    }
  },

  // 3. Verify code (registration)
  verifyCode: async (email: string, code: string, rememberMe: boolean = false) => {
    authService.clearStorage();
    localStorage.removeItem(REMEMBER_ME_KEY);

    try {
      const response = await api.post('/users/verify-code', { email, code });

      const dataObj = response.data?.data;
      if (dataObj?.token) {
        sessionStorage.setItem(TOKEN_KEY, dataObj.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(dataObj.user));

        if (rememberMe) {
          localStorage.setItem(REMEMBER_ME_KEY, 'true');
          localStorage.setItem(TOKEN_KEY, dataObj.token);
          localStorage.setItem(USER_KEY, JSON.stringify(dataObj.user));
        }

        console.log('💾 Registration - Token saved to sessionStorage');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Verification API Error:', error);
      throw error;
    }
  },

  // 4. Logout - ✅ clears everything
  logout: () => {
    authService.clearStorage();
    localStorage.removeItem(REMEMBER_ME_KEY);
  },

  // ✅ Single helper to wipe all auth data atomically
  clearStorage: () => {
    console.log('🧹 clearStorage called - wiping everything') 
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // ✅ Single source of truth - sessionStorage first, then localStorage fallback
  getCurrentUser: () => {
    const raw = sessionStorage.getItem(USER_KEY) ?? localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      authService.clearStorage(); // corrupt data — wipe it
      return null;
    }
  },

  // ✅ Same priority: sessionStorage first
  getToken: () => {
    return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
  },

  // ✅ On app load, re-hydrate sessionStorage from localStorage if rememberMe was set
  rehydrateSession: () => {
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (rememberMe && token && user) {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, user);
      console.log('🔄 Session rehydrated from localStorage');
    }
  }
};