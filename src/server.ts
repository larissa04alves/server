import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";
import { createRoomRoute } from "./http/routes/create-room.ts";
import { getRoomQuestions } from "./http/routes/get-room-questions.ts";
import { createQuestionRoute } from "./http/routes/create-question.ts";
import { uploadAudioRoute } from "./http/routes/upload-audio.ts";
import fastifyMultipart from "@fastify/multipart";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, { origin: "*" });
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyMultipart);

app.get("/health", () => {
    return "OK";
});

app.register(getRoomsRoute);

app.register(createRoomRoute);

app.register(getRoomQuestions);

app.register(createQuestionRoute);

app.register(uploadAudioRoute);

app.listen({ port: env.PORT });
