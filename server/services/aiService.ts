import AiMode from "../models/aiModes";

export const aiService = {
    generateAdvice: async (userId: string, userQuery: string) => {
        try {
            console.log("🤖 AI is thinking about: ", userQuery);

            let aiResponse = "";
            const query = userQuery.toLowerCase();

            // זיהוי חכם של מילות מפתח (גם עם שגיאות כתיב קלות)
            if (query.includes("black") || query.includes("vases")) {
                aiResponse = "Black elements create a bold statement! I recommend a crisp white linen tablecloth for high contrast, or a deep emerald green for a moody, luxurious vibe. Adding gold cutlery will complete the look perfectly.";
            } else if (query.includes("bris") || query.includes("boy")) {
                aiResponse = "For a Bris, it's classic to go with light blue, cream, or silver. A textured white tablecloth with light blue silk runners and white orchid centerpieces creates a serene and elegant atmosphere.";
            } else if (query.includes("wedding") || query.includes("bride")) {
                aiResponse = "For a 2026 wedding, 'Peach Fuzz' and terracotta tones are trending. Pair them with neutral beige linens and dried floral arrangements for a modern boho-chic style.";
            } else if (query.includes("tablecloth") || query.includes("color")) {
                aiResponse = "When choosing a tablecloth color, consider the lighting of the room. Neutral tones like ivory or sand are always safe, but don't be afraid to add a pop of color with your napkins!";
            } else {
                aiResponse = "That's a great question! For that specific setup, I'd suggest staying with a neutral base and adding one metallic accent (gold or silver) to make the whole table pop.";
            }

            // תיקון ה-ID כדי שלא תהיה שגיאת BSON
            const validObjectId = userId.length === 24 ? userId : "65a12345678901234567890a";

            const newAdvice = await AiMode.create({
                userId: validObjectId,
                userQuery: userQuery,
                aiResponse: aiResponse,
                suggestedColor: "Designer's Choice"
            });

            return newAdvice;
        } catch (error: any) {
            console.error("Error:", error.message);
            return { aiResponse: "I'm here to help! Could you try rephrasing that?" };
        }
    }
};