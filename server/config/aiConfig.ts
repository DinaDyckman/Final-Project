//חיבור לגמיני
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

// יצירת מפתח ה-API מהמשתנים המוגנים
const apiKey = process.env.GEMINI_API_KEY || "";

// אתחול הספריה של גוגל
const genAI = new GoogleGenerativeAI(apiKey);

// ייצוא המודל הספציפי שאיתו נעבוד (gemini-1.5-flash הוא מהיר וחינמי)
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });