import z from "zod";

export const recordsSchema = z.object({
  mark: z.array(z.object({ text: z.string() })).nullable(),
  type: z.enum(["ldap", "local"]),
  login: z.string().max(100),
  password: z.string().max(100),
});

export type Record = z.infer<typeof recordsSchema>;
