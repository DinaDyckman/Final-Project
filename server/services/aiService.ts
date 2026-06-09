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
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY || ''}`,
                    "Content-Type": "application/json"
                },
                signal: controller.signal,
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert Event Design & Planning Assistant for Upscale Simcha Rental. 
                            You help clients plan weddings, bar/bat mitzvahs, birthdays, corporate events, and all types of simchas.
                            Give specific, practical, elegant advice about decor, color palettes, table settings, centerpieces, lighting, and rental items.
                            Always answer in the same language the user writes in (Hebrew or English).
                            Keep responses concise, warm, and professional.`
                        },
                        { role: "user", content: userQuery }
                    ]
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

        if (q.includes("wedding") || q.includes("חתונה")) return "For a wedding, I recommend ivory or champagne tablecloths with floral centerpieces in white and blush. Gold cutlery and crystal glassware add an elegant touch. String lights or a chandelier create beautiful romantic ambiance.";
        if (q.includes("bar mitzvah") || q.includes("בר מצווה")) return "For a Bar Mitzvah, navy blue and gold is a classic combination. Use gold chiavari chairs, navy tablecloths, and tall centerpieces with white flowers and gold accents. LED uplighting in blue adds drama.";
        if (q.includes("bat mitzvah") || q.includes("בת מצווה")) return "For a Bat Mitzvah, rose gold and blush is trending beautifully. Try blush pink tablecloths, rose gold sequin backdrop, floral centerpieces with peonies, and fairy light curtains for a magical atmosphere.";
        if (q.includes("bris") || q.includes("brit") || q.includes("ברית")) return "For a Bris, keep it elegant and soft. White or cream tablecloths with light blue velvet runners, silver mercury vase centerpieces, and crystal candle holders create a beautiful serene atmosphere.";
        if (q.includes("birthday") || q.includes("יום הולדת")) return "For a birthday party, match the color scheme to the guest of honor's personality. Balloon arch backdrops, sequin tablecloths, and neon signs are very popular. String lights add a festive touch to any venue.";
        if (q.includes("corporate") || q.includes("עסקי")) return "For a corporate event, keep it sleek and professional. White or charcoal gray tablecloths, simple floral centerpieces, good lighting with LED uplighting, and a step-and-repeat backdrop for branding work perfectly.";
        if (q.includes("black") || q.includes("שחור")) return "Black tablecloths pair beautifully with gold or silver accents. Try gold cutlery, crystal centerpieces, and spotlight lighting for a dramatic upscale look. A gold sequin backdrop completes the luxury feel.";
        if (q.includes("pink") || q.includes("ורוד")) return "Pink works beautifully in blush, dusty rose, or hot pink. Pair blush pink tablecloths with white floral centerpieces and rose gold cutlery. A floral wall backdrop or fairy light curtain adds a romantic touch.";
        if (q.includes("white") || q.includes("לבן")) return "All-white is timeless and elegant. White tablecloths, white floral centerpieces, ivory candle holders, and crystal glassware create a pristine sophisticated look. Add one metallic accent like gold or silver to prevent it looking flat.";
        if (q.includes("gold") || q.includes("זהב")) return "Gold is the ultimate luxury accent. Pair gold chiavari chairs with champagne linens, gold cutlery, gold sequin tablecloths for the head table, and crystal chandeliers. LED uplighting in warm amber enhances the gold tones beautifully.";
        if (q.includes("color") || q.includes("colour") || q.includes("צבע")) return "Follow the 60-30-10 rule: 60% neutral base (ivory, white, champagne), 30% main color (navy, blush, emerald), and 10% metallic accent (gold or silver). This creates a balanced, professional look every time.";
        if (q.includes("chair") || q.includes("כיסא")) return "Chiavari chairs in gold or silver are the most popular for elegant events. Ghost chairs work beautifully for modern minimalist events. Cross-back chairs are perfect for rustic or boho themes.";
        if (q.includes("table") || q.includes("שולחן")) return "Round banquet tables create better conversation flow. For a head table, consider a sweetheart table for the couple or a long farmhouse table for family style seating. Bar height cocktail tables are great for the reception area.";
        if (q.includes("light") || q.includes("תאורה")) return "Lighting transforms any venue. String lights create warmth, LED uplighting adds color drama, a crystal chandelier adds luxury, and fairy light curtains make magical photo backdrops. Always layer your lighting for best effect.";
        if (q.includes("centerpiece") || q.includes("מרכז שולחן")) return "Tall centerpieces with branches and hanging crystals create drama. Low centerpieces with garden roses and candles feel intimate. Mix heights at different tables for visual interest. Always use odd numbers of elements for better aesthetics.";
        if (q.includes("budget") || q.includes("תקציב") || q.includes("cheap") || q.includes("afford")) return "To maximize your budget: invest in good tablecloths and lighting as they transform the space most. Use simple white floral centerpieces with greenery instead of exotic flowers. Candles add luxury at low cost. Rent charger plates to elevate basic tableware.";
        if (q.includes("outdoor") || q.includes("חוץ")) return "For outdoor events, string lights or globe lights strung overhead create a magical canopy effect. Use weighted centerpieces. Have a tent or sail shade for weather protection. Edison bulb string lights work beautifully for garden settings.";
        if (q.includes("kids") || q.includes("ילדים")) return "For kids' areas, set up a separate activity table with bright colors. Use durable plastic tableware, balloon decorations, and keep centerpieces low and safe. A photo booth machine is always a hit with kids and parents alike.";
        return "Great question! For any upscale event, focus on three key elements: elegant linens, beautiful lighting, and cohesive centerpieces. Start with a neutral base color and add two accent colors. Would you like specific advice about a particular aspect of your event?";
    },

    getUserHistory: async (userId: string) => {
        try {
            return await AiMode.find().sort({ createdAt: -1 });
        } catch (e) {
            return [];
        }
    }
};
