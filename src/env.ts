import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000), //Faz a conversão para número e define o valor padrão como 3000
    DATABASE_URL: z.string().url().startsWith("postgresql://"), //Valida a URL do banco de dados e define o valor padrão
});

export const env = envSchema.parse(process.env); //Valida as variáveis de ambiente com o schema definido
