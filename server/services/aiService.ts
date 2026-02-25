import AiMode from "../models/aiModes";

export const aiService = {
    generateAdvice: async (userId: string, userQuery: string) => {
        try {
            const apiKey = process.env.GEMINI_API_KEY;
           const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userQuery }] }]
                })
            });

            const data: any = await response.json();

            if (!response.ok) {
                console.error("GOOGLE API ERROR:", JSON.stringify(data, null, 2));
                throw new Error(data.error?.message || "API Error");
            }

            const aiText = data.candidates[0].content.parts[0].text;

            return await AiMode.create({
                userId,
                userQuery,
                aiResponse: aiText,
                suggestedColor: "Original Flow"
            });
        } catch (error: any) {
            console.error("Final Debug:", error.message);
            throw new Error("Failed to get advice");
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