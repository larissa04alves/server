import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { schema } from "../../db/schema/index.ts";
import { db } from "../../db/connection.ts";
import { count, eq } from "drizzle-orm";
import { create } from "domain";

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
    app.get("/rooms", async () => {
        const rooms = await db
            .select({
                roomId: schema.rooms.id,
                roomName: schema.rooms.name,
                createdAt: schema.rooms.createdAt,
                questionsCount: count(schema.questions.id),
            })
            .from(schema.rooms)
            .leftJoin(schema.questions, eq(schema.questions.roomId, schema.rooms.id))
            .groupBy(schema.rooms.id, schema.rooms.name)
            .orderBy(schema.rooms.createdAt);
        return rooms;
    });
};
