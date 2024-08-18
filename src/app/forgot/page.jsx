"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import GridPattern from "@/components/magicui/grid-pattern";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export function GridPatternDemo() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: Reset Password
  const [loader, setLoader] = useState(false);
  const toast =useToast()
  const router =useRouter();
  const handleSendOtp = async () => {
    setLoader(true);
    try {
      // Send OTP to user's email
      
      await axios.post("/api/send-otp", { email });
      setStep(2);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoader(true);
    try {
      // Verify OTP
      const response = await axios.post("/api/verify-otp", { otp });
      if (response.status === 200) {
        setStep(3);
      } else {
        toast({
          title: "OTP is incorrect",
          status: "error",  // Use "error" instead of "danger"
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Both password and confirm password should be the same",
        status: "error",  // Use "error" instead of "danger"
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setLoader(true);
    try {
      // Reset Password
      const res = await axios.post("/api/reset-password", { email, password });
      toast({
        title: "Password reset successfully",
        status: "success",  // Use "success" to indicate the action was successful
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      router.push("/")
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };
  

  return (
    <div className="relative flex h-[100vh] w-full flex-col items-center justify-center overflow-hidden bg-black">
      <p className="z-10 mb-8 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
        Reset Password
      </p>
      <div className="z-10 flex flex-col items-center justify-center space-y-4 bg-black p-6 rounded-lg shadow-lg">
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-black rounded outline-none"
            />
            {!loader ? (
              <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={handleSendOtp}
            >
             Send OTP
            </Button>
            ) : (
              <Spinner size={"md"} />
            )}
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 text-black rounded outline-none"
            />
            {!loader ? (
              <button
                onClick={handleVerifyOtp}
                className="px-6 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Verify OTP
              </button>
            ) : (
              <Spinner size={"md"} />
            )}
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-black rounded outline-none"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-black rounded outline-none"
            />
            {!loader ? (
              <button
                onClick={handleResetPassword}
                className="px-6 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Reset Password
              </button>
            ) : (
              <Spinner size={"md"} />
            )}
          </>
        )}
      </div>
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [15, 10],
          [10, 15],
          [15, 10],
        ]}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "absolute inset-0 h-full w-full skew-y-12"
        )}
      />
    </div>
  );
}

export default GridPatternDemo;
