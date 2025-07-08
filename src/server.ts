import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "./env.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, { origin: "*" });
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/health", () => {
    return "OK";
});

app.listen({ port: env.PORT });
