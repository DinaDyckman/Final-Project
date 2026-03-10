import axios from "axios";
import AiMode from "../models/aiModes";

export const aiService = {
    generateAdvice: async (userId: string, userQuery: string) => {
        // וידוא מזהה משתמש תקין ל-MongoDB
        const validObjectId = userId.length === 24 ? userId : "65a12345678901234567890a";
        
        // משיכת המפתח מה-env
        const apiKey = (process.env.GROQ_API_KEY || "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").trim();

        try {
            console.log("🚀 Connecting to Groq Expert (Event-Only Mode)...");
            
            const response = await axios({
                method: 'post',
                url: 'https://api.groq.com/openai/v1/chat/completions',
                data: {
                    model: "llama-3.3-70b-versatile", 
                    messages: [
                        { 
                            role: "system", 
                            content: `You are a strict Event Design & Planning Expert. 
                            RULES:
                            1. ONLY answer questions related to events (Weddings, Bar/Bat Mitzvahs, Brit Milah, Birthdays, Corporate events, etc.), decor, color palettes, and event organization.
                            2. If the user's question is NOT about events (e.g., math, general knowledge, jokes, coding), you MUST respond with: "מצטער, אני יכול לעזור רק בשאלות הקשורות לעיצוב ותכנון אירועים. / I'm sorry, I can only assist with event design and planning questions."
                            3. Always answer in the language the user used (Hebrew or English).
                            4. Keep advice professional, elegant, and practical.` 
                        },
                        { role: "user", content: userQuery }
                    ],
                    temperature: 0.6 // טמפרטורה נמוכה יותר הופכת אותו ליותר ממוקד ופחות "ממציא"
                },
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const aiResponse = response.data.choices[0].message.content;

            console.log("👑 VICTORY!!! THE EXPERT AGENT RESPONDED.");
            
            // שמירה ל-Database
            return await AiMode.create({
                userId: validObjectId,
                userQuery,
                aiResponse,
                suggestedColor: "Groq-Expert-Live"
            });

        } catch (error: any) {
            console.error("❌ API Error:", error.response?.data || error.message);
            
            // הגנה למקרה של תקלה טכנית
            return await AiMode.create({
                userId: validObjectId,
                userQuery,
                aiResponse: "מצטער, יש לי תקלה קלה בחיבור. בכל מקרה, עבור האירוע שלך הייתי ממליץ על צבעים קלאסיים כמו לבן וזהב.",
                suggestedColor: "Emergency-Fallback"
            });
        }
    },
    getUserHistory: async (userId: string) => {
        try {
            const history = await AiMode.find({ userId });
            return history;
        } catch (error: any) {
            console.error("Error fetching user history:", error.message);
            throw new Error("Failed to get user history");
        }
    }
};