import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // เร็ว + ถูก
  });

  const result = await model.generateContent(`
Improve this prompt to be more professional, structured, and clear:

${prompt}
`);

  const text = result.response.text();

  return Response.json({ result: text });
}