import z from "zod";

export const accountSchema = z.object({
  id: z.number().nullable(),
  mark: z.array(z.object({ text: z.string() })).nullable(),
  type: z.enum(["ldap", "local"]),
  login: z.string().max(100),
  password: z.string().max(100),
});

export type Account = z.infer<typeof accountSchema>;
