import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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"
});

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  try {
    const forwardedProps = await req.json();

    const stream = openai.beta.chat.completions
      .stream({
        model: "gpt-4-1106-preview",
        ...forwardedProps,
        stream: true,
      })
      .toReadableStream();

    return new Response(stream);
  } catch (error) {
    return new Response("", { status: 500, statusText: error.error.message });
  }
}
