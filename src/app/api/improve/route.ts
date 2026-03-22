export async function POST(req: Request) {
  const { prompt } = await req.json();

  const improved = prompt + `
  
# Improved Version:
- Better structure
- Clear constraints
- More professional tone
`;

  return Response.json({ result: improved });
}