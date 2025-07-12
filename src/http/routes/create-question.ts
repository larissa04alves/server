import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { schema } from "../../db/schema/index.ts";
import { db } from "../../db/connection.ts";
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts";
import { eq, and, sql } from "drizzle-orm/sql";

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
    app.post(
        "/rooms/:roomId/questions",
        {
            schema: {
                params: z.object({
                    roomId: z.string(),
                }),
                body: z.object({
                    question: z.string().min(1),
                }),
            },
        },
        async (request, reply) => {
            const { roomId } = request.params;
            const { question } = request.body;

            const embedding = await generateEmbeddings(question);

            const embeddingAsString = `[${embedding.join(",")}]`;

            const chunks = await db
                .select({
                    id: schema.audioChunks.id,
                    trasncription: schema.audioChunks.trasncription,
                    similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingAsString}:: vector)`,
                })
                .from(schema.audioChunks)
                .where(
                    and(
                        eq(schema.audioChunks.roomId, roomId),
                        sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingAsString}:: vector) > 0.7`
                    )
                )
                .orderBy(sql`(${schema.audioChunks.embeddings} <=> ${embeddingAsString}:: vector)`)
                .limit(3);

            let answer: string | null = null;

            if (chunks.length > 0) {
                const transcriptions = chunks.map((chunk) => chunk.trasncription);

                answer = await generateAnswer(question, transcriptions);
            }

            const result = await db
                .insert(schema.questions)
                .values({ roomId, question, answer })
                .returning();

            const insertedQuestion = result[0];
            if (!insertedQuestion) {
                throw new Error("Failed to create new question");
            }
            return reply.status(201).send({ questionId: insertedQuestion.id, answer });
        }
    );
};
