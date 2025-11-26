"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OTPVerification } from "@/components/otp-verification";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const emailSchema = z.object({
  email: z.email(),
});

const passwordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormStep = "email" | "otp" | "password";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>("email");
  const [userEmail, setUserEmail] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const sendOTPMutation = useMutation({
    mutationFn: async (email: string) => {
      return await authClient.forgetPassword.emailOtp({
        email,
      });
    },
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message || "Failed to send OTP");
      } else {
        toast.success("OTP sent to your email!");
        setStep("otp");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send OTP");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (values: z.infer<typeof passwordSchema>) => {
      return await authClient.emailOtp.resetPassword({
        email: userEmail,
        otp: verifiedOtp,
        password: values.password,
      });
    },
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message || "Failed to reset password");
      } else {
        toast.success("Password reset successfully!");
        router.push("/signin");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });

  const onEmailSubmit = (values: z.infer<typeof emailSchema>) => {
    setUserEmail(values.email);
    sendOTPMutation.mutate(values.email);
  };

  const handleOTPSuccess = (verifiedOtp?: string) => {
    if (verifiedOtp) {
      setVerifiedOtp(verifiedOtp);
    }
    setStep("password");
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    resetPasswordMutation.mutate(values);
  };

  if (step === "otp") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <OTPVerification
          email={userEmail}
          type="forget-password"
          onSuccess={handleOTPSuccess}
          onBack={() => setStep("email")}
        />
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    );
  }

  if (step === "password") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Set new password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <FieldGroup>
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="******"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="******"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Field>
                    <Button
                      type="submit"
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                    <FieldDescription className="text-center">
                      <button
                        type="button"
                        onClick={() => setStep("otp")}
                        className="underline-offset-4 hover:underline"
                      >
                        Back to verification
                      </button>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </Form>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email to receive a verification code
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
              <FieldGroup>
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Field>
                  <Button type="submit" disabled={sendOTPMutation.isPending}>
                    {sendOTPMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                  <FieldDescription className="text-center">
                    Remember your password? <Link href="/signin">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
