import z from "zod";

const signInSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

const signUpSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.email("Informe um e-mail válido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignInInput = z.infer<typeof signInSchema>;
type SignUpInput = z.infer<typeof signUpSchema>;

export { signInSchema, signUpSchema, type SignInInput, type SignUpInput };
