import z from "zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../api/auth";
import SignupHeader from "../components/signup/SignupHeader";
import EmailStep from "../components/signup/EmailStep";
import PasswordStep from "../components/signup/PasswordStep";
import ProfileStep from "../components/signup/ProfileStep";
import { zodResolver } from "@hookform/resolvers/zod";

const emailSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
});
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상입니다." })
      .max(20, { message: "비밀번호는 20자 이하입니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상입니다." })
      .max(20, { message: "비밀번호는 20자 이하입니다." }),
  })
  .refine((d) => d.password === d.passwordCheck, {
    path: ["passwordCheck"],
    message: "비밀번호가 일치하지 않습니다.",
  });
const nameSchema = z.object({
  name: z.string().min(1, { message: "이름을 입력해주세요." }),
});

const formSchema = emailSchema.merge(passwordSchema).merge(nameSchema);

export type FormFields = z.infer<typeof emailSchema> &
  z.infer<typeof passwordSchema> &
  z.infer<typeof nameSchema>;

export type Step = 1 | 2 | 3;

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", passwordCheck: "", name: "" },
  });

  const email = watch("email");
  const password = watch("password");
  const passwordCheck = watch("passwordCheck");
  const name = watch("name");

  const isEmailValid = useMemo(
    () => emailSchema.safeParse({ email }).success,
    [email]
  );
  const isPasswordValid = useMemo(
    () => passwordSchema.safeParse({ password, passwordCheck }).success,
    [password, passwordCheck]
  );
  const isNameValid = useMemo(
    () => nameSchema.safeParse({ name }).success,
    [name]
  );

  const prevStep = (s: Step): Step => (s === 1 ? 1 : ((s - 1) as Step));
  const nextStep = (s: Step): Step => (s === 3 ? 3 : ((s + 1) as Step));

  const goBack = () => {
    if (step === 1) navigate("/");
    else setStep((s) => prevStep(s));
  };

  const goNextFromEmail = () => {
    const r = emailSchema.safeParse({ email });
    if (!r.success) {
      setError("email", {
        message: r.error.issues[0]?.message || "이메일 오류",
      });
      return;
    }
    clearErrors("email");
    setStep(2);
  };

  const goNextFromPassword = () => {
    const r = passwordSchema.safeParse({ password, passwordCheck });
    if (!r.success) {
      r.error.issues.forEach((i) => {
        const key = i.path?.[0];
        if (key === "password" || key === "passwordCheck") {
          setError(key, { message: i.message });
        }
      });
      return;
    }
    clearErrors(["password", "passwordCheck"]);
    setStep((s) => nextStep(s));
  };

  const onComplete = async () => {
    const e = emailSchema.safeParse({ email });
    const p = passwordSchema.safeParse({ password, passwordCheck });
    const n = nameSchema.safeParse({ name });
    if (!e.success || !p.success || !n.success) return;

    try {
      await postSignup({ email, password, name });
      navigate("/");
    } catch {
      alert("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="w-full h-[calc(100%-90px)] flex flex-col justify-center items-center text-white bg-black">
      <div className="w-[400px] flex flex-col items-center gap-4">
        <SignupHeader
          title="회원가입"
          onBack={goBack}
          showEmail={step === 2}
          email={email}
        />

        {step === 1 && (
          <EmailStep
            register={register}
            errors={errors}
            canNext={isEmailValid}
            onNext={goNextFromEmail}
          />
        )}

        {step === 2 && (
          <PasswordStep
            register={register}
            errors={errors}
            canNext={isPasswordValid}
            onNext={goNextFromPassword}
          />
        )}

        {step === 3 && (
          <ProfileStep
            register={register}
            errors={errors}
            canSubmit={isNameValid && !isSubmitting}
            onSubmit={handleSubmit(onComplete)}
            submitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
