import axios from 'axios';

// כתובת הבסיס של השרת - ודאי שהיא תואמת למה שמוגדר ב-vite.config
const API_URL = '/api/rentals'; 

export const createRental = async (rentalData: any) => {
    try {
        // שליחת הבקשה לשרת
        const response = await axios.post(`${API_URL}/checkout`, rentalData);
        return response.data;
    } catch (error) {
        console.error("Error creating rental:", error);
        throw error;
    }
};

// תוכלי להוסיף כאן בהמשך פונקציות נוספות כמו גט השכרות למשתמש