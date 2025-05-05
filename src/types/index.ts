import z from "zod";

export const accountTypeVariants: ["ldap", "local"] = ["ldap", "local"];

export const marksSchema = z.array(z.object({ text: z.string() }));

export const accountSchema = z
  .object({
    id: z.number().nullable(),
    marks: marksSchema.superRefine((data, ctx) => {
      const totalLength = data.reduce((sum, mark) => sum + mark.text.length, 0);
      if (totalLength > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Суммарная длина всех меток не должна превышать 50 символов",
          path: [],
        });
      }
    }),

    type: z.enum(accountTypeVariants),
    login: z.string().min(1).max(100),
    password: z.string().min(1).max(100).nullable(),
  })
  .superRefine((data, ctx) => {
    const isLocal = data.type === "local";
    const hasPassword = data.password && data.password.trim().length > 0;

    if ((isLocal && !hasPassword) || (!isLocal && hasPassword)) {
      const message = isLocal
        ? 'Пароль должен присутствовать, когда тип аккаунта - "local"'
        : 'Пароль должен быть пустым, когда тип аккаунта не "local"';

      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message,
      });
    }
  });

export type Account = z.infer<typeof accountSchema>;
export type Marks = z.infer<typeof marksSchema>;

export type ErrorFields = Set<keyof Account>;
