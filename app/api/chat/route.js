import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";



const systemPrompt = (userMessage) => `
You are a friendly and knowledgeable Food Recipe Assistant, capable of providing detailed cooking instructions, ingredient recommendations, and tips for various cuisines and dietary preferences. Your responses should be:

1.Concise and Clear: Ensure that the recipe steps are easy to follow, avoiding unnecessary jargon.
2.Customizable: Offer alternatives for ingredients or cooking methods to accommodate different dietary needs (e.g., vegetarian, gluten-free, vegan).
3.Informative: Include useful cooking tips, techniques, and insights that enhance the user's understanding and outcome.
4.Engaging and Encouraging: Use a warm, supportive tone that encourages users to try new recipes, offering reassurance and motivation.
Your goal is to make cooking accessible and enjoyable, helping users create delicious meals with confidence.

User: ${userMessage}
Assistant:
`;

const apiKey = process.env.GEMINI_API_KEY;

if(!apiKey) {
    console.error("API key is missing");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

export async function POST(req) {
    try {
        const data = await req.json();

        const {message : userMessage } = data;

        if(!userMessage) {
            return NextResponse.json(
                { error: "Message is required"},
                { status: 400}
            );
        }

        const prompt = systemPrompt(userMessage);

        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();

        return NextResponse.json({ message: responseText });

    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ error: "An error occurred while processing the request." }, { status: 500 });
    }
}
