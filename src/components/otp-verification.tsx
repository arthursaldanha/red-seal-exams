/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import { authClient } from "@/lib/auth-client";

type OTPType = "sign-in" | "email-verification" | "forget-password";

interface OTPVerificationProps {
  email: string;
  type: OTPType;
  onSuccess: (verifiedOtp?: string) => void;
  onBack?: () => void;
  newPassword?: string;
}

type OTPConfig = {
  title: string;
  description: string;
  successMessage: string;
  verifyFn: (
    email: string,
    otp: string,
    newPassword?: string
  ) => Promise<unknown>;
};

const OTP_CONFIG: Record<OTPType, OTPConfig> = {
  "email-verification": {
    title: "Verify your email",
    description: "We sent a 6-digit code to",
    successMessage: "Email verified successfully!",
    verifyFn: async (email, otp) =>
      await authClient.emailOtp.verifyEmail({ email, otp }),
  },
  "sign-in": {
    title: "Enter verification code",
    description: "We sent a 6-digit code to",
    successMessage: "Signed in successfully!",
    verifyFn: async (email, otp) =>
      await authClient.signIn.emailOtp({ email, otp }),
  },
  "forget-password": {
    title: "Verify your code",
    description: "We sent a verification code to",
    successMessage: "Code verified successfully!",
    verifyFn: async (email, otp) =>
      await authClient.emailOtp.checkVerificationOtp({
        email,
        otp,
        type: "forget-password",
      }),
  },
};

export function OTPVerification({
  email,
  type,
  onSuccess,
  onBack,
  newPassword,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(90);
  const canResend = timeLeft === 0;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const config = OTP_CONFIG[type];

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      return await config.verifyFn(email, code, newPassword);
    },
    onSuccess: (data: any) => {
      if (data?.error) {
        toast.error(data.error.message || "Invalid OTP code");
      } else {
        toast.success(config.successMessage);
        onSuccess(otp);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to verify OTP");
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      return await authClient.emailOtp.sendVerificationOtp({
        email,
        type,
      });
    },
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message || "Failed to resend OTP");
      } else {
        toast.success("OTP sent successfully!");
        setTimeLeft(90);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to resend OTP");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      verifyMutation.mutate(otp);
    }
  };

  const handleResend = () => {
    if (canResend) {
      resendMutation.mutate();
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{config.title}</CardTitle>
        <CardDescription>
          {config.description} {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp" className="sr-only">
                Verification code
              </FieldLabel>
              <InputOTP
                maxLength={6}
                id="otp"
                value={otp}
                onChange={setOtp}
                required
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription className="text-center">
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>

            <Button
              type="submit"
              disabled={otp.length !== 6 || verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>

            <FieldDescription className="text-center">
              {!canResend ? (
                <span>Resend code in {timeLeft}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendMutation.isPending}
                  className="underline-offset-4 hover:underline"
                >
                  {resendMutation.isPending ? "Sending..." : "Resend code"}
                </button>
              )}
            </FieldDescription>

            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
