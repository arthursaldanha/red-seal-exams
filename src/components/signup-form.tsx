"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { OTPVerification } from "@/components/otp-verification";

import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // First create the account
      const signUpResult = await authClient.signUp.email({
        name: values.fullName,
        email: values.email,
        password: values.password,
      });

      if (signUpResult?.error) {
        throw new Error(signUpResult.error.message);
      }

      // Then manually send the OTP
      const otpResult = await authClient.emailOtp.sendVerificationOtp({
        email: values.email,
        type: "email-verification",
      });

      if (otpResult?.error) {
        throw new Error(otpResult.error.message);
      }

      return signUpResult;
    },
    onSuccess: () => {
      toast.success("Account created! Please verify your email.");
      setUserEmail(form.getValues("email"));
      setShowOTP(true);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign up");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signUpMutation.mutate(values);
  };

  const handleOTPSuccess = () => {
    router.push("/signin");
  };

  if (showOTP) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <OTPVerification
          email={userEmail}
          type="email-verification"
          onSuccess={handleOTPSuccess}
          onBack={() => setShowOTP(false)}
        />
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
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="******"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                <Field>
                  <Button type="submit" disabled={signUpMutation.isPending}>
                    {signUpMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <Link href="/signin">Sign in</Link>
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
