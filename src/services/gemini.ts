import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

const gemini = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
});

const model = "gemini-1.5-flash";

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
    try {
        const response = await gemini.models.generateContent({
            model,
            contents: [
                {
                    text: "Transcreva exatamente o que está sendo falado no áudio para português brasileiro. Apenas transcreva as palavras faladas, sem adicionar interpretações, explicações ou informações extras. Seja fiel ao que realmente foi dito.",
                },
                {
                    inlineData: {
                        mimeType,
                        data: audioAsBase64,
                    },
                },
            ],
        });

        if (!response.text) {
            throw new Error("Failed to transcribe audio");
        }

        return response.text;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Transcription failed: ${errorMessage}`);
    }
}

export async function generateEmbeddings(text: string) {
    const response = await gemini.models.embedContent({
        model: "text-embedding-004",
        contents: [{ text }],
        config: {
            taskType: "RETRIEVAL_DOCUMENT",
        },
    });

    if (!response.embeddings?.[0].values) {
        throw new Error("Failed to generate embeddings");
    }

    return response.embeddings[0].values;
}

export async function generateAnswer(question: string, transcriptions: string[]) {
    const context = transcriptions.join("\n\n");
    const prompt = `
    Com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e precisa em inglês.

    CONTEXTO:
    ${context}

    PERGUNTA:
    ${question}

    INSTRUÇÕES:
    - USe apenas informacoes contidas no contexto enviado;
    - Se a resposta não for encontrada no contexto, apenas responda que não possui informações suficientes;
    - Responda de forma direta e objetiva;
    - Mantenha um tom educativo e profissional;
    - cite trechos relevantes do contexto na resposta, se apropriado;
    - Se for citar o contexto, utilize o termo "conteúdo da aula";
    `.trim();
    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: prompt,
            },
        ],
    });

    if (!response.text) {
        throw new Error("Failed to generate answer for Gemini");
    }
    return response.text;
}
