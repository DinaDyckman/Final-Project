import AiMode from "../models/aiModes";
import mongoose from "mongoose";
import https from "https";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export const aiService = {
    generateAdvice: async (userId: string, userQuery: string) => {
        let aiResponse = "";
        let dataSource = "";

        try {
            console.log(`🚀 Processing query: "${userQuery}"`);
            console.log("🌐 Attempting to reach Groq Cloud...");

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY || ''}`,
                    "Content-Type": "application/json"
                },
                signal: controller.signal,
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: userQuery }]
                })
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("API_BLOCKED");

            const data: any = await response.json();
            aiResponse = data.choices[0].message.content;
            dataSource = "Groq-Cloud-AI";
            console.log("✅ Groq responded successfully!");

        } catch (error: any) {
            console.log("🔌 Offline Mode: Groq unreachable. Switching to Expert System.");
            aiResponse = aiService.generateOfflineResponse(userQuery);
            dataSource = "Internal-Designer-Engine";
        }

        const validUserId = mongoose.Types.ObjectId.isValid(userId)
            ? new mongoose.Types.ObjectId(userId)
            : new mongoose.Types.ObjectId();

        console.log("💾 Saving to MongoDB...");

        return await AiMode.create({
            userId: validUserId,
            userQuery,
            aiResponse,
            suggestedColor: dataSource
        });
    },

    generateOfflineResponse: (query: string): string => {
        const q = query.toLowerCase();
        console.log("🔍 Offline Engine searching for keywords in:", q);

        if (q.includes("brit") || q.includes("bris") || q.includes("ברית")) {
            return "Designer Advice: For a Bris, I recommend a 'Cloud White' or 'Cream' tablecloth with light blue velvet runners. Add silver or crystal vases to create a high-end, royal atmosphere.";
        }
        if (q.includes("bat mitzvah") || q.includes("בת מצווה")) {
            return "Designer Advice: For an upscale Bat Mitzvah, use Rose Gold tablecloths with white floral centerpieces. Adding silk napkins and gold cutlery will elevate the luxury feel.";
        }
        if (q.includes("color") || q.includes("colour") || q.includes("צבע")) {
            return "Designer Advice: To maintain an upscale look, follow the 60-30-10 rule: 60% neutral base (like ivory), 30% secondary color, and 10% metallic accents (Gold or Silver).";
        }
        return "Designer Advice: Focus on high-quality textures. Mixing matte linens with glass and metallic accents always creates a more expensive and curated atmosphere, regardless of the specific event type.";
    },

    getUserHistory: async (userId: string) => {
        try {
            return await AiMode.find().sort({ createdAt: -1 });
        } catch (e) {
            return [];
        }
    }
};
