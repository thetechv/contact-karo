"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import tagService from "@/fe/services/tagService";
import {
  Input,
  Select,
  Textarea,
  Button,
  LoadingSpinner,
} from "@/fe/components/ui";

type Step = "phone" | "otp" | "edit";

export default function EditTagPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tagId = params?.id || "";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    vehicle_no: "",
    vehicle_type: "car",
    emergency_contact_1: "",
    emergency_contact_2: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Enter valid 10-digit phone number");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await tagService.generateOtpToUpdateTag(tagId, phone);
      if (response.success) {
        setStep("otp");
        setOtpTimer(120); // 2 minutes
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await tagService.verifyOtp(tagId, otp, phone);
      if (response.success && response.data?.user) {
        const user = response.data.user;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          whatsapp: user.whatsapp || "",
          vehicle_no: user.vehicle_no || "",
          vehicle_type: user.vehicle_type || "car",
          emergency_contact_1: user.emergency_contact_1 || "",
          emergency_contact_2: user.emergency_contact_2 || "",
          address: user.address || "",
        });
        setStep("edit");
      } else {
        setError(response.message || "OTP verification failed");
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await tagService.updateTag(tagId, formData);
      if (response.success) {
        setSuccess("Details updated successfully!");
        setTimeout(() => router.push(`/tag/${tagId}`), 2000);
      } else {
        setError(response.message || "Update failed");
      }
    } catch (err: any) {
      setError(err?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Tag Details
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg">
              {success}
            </div>
          )}

          {step === "phone" && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter the phone number associated with this QR tag
              </p>
              <Input
                label="Phone Number"
                type="tel"
                placeholder="10-digit phone number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                required
              />
              <Button
                type="submit"
                disabled={submitting || phone.length !== 10}
                className="w-full"
              >
                {submitting ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Enter 6-digit OTP sent to {phone}
              </p>
              <div className="flex gap-2 justify-center">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const newOtp = otp.split("");
                      newOtp[i] = val;
                      setOtp(newOtp.join("").slice(0, 6));
                      if (val && i < 5) {
                        const nextInput = e.target
                          .nextElementSibling as HTMLInputElement;
                        nextInput?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 dark:border-gray-700 focus:border-yellow-400 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                ))}
              </div>
              {otpTimer > 0 && (
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  OTP expires in: {Math.floor(otpTimer / 60)}:
                  {(otpTimer % 60).toString().padStart(2, "0")}
                </p>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("phone")}
                  className="flex-1 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="flex-1"
                >
                  Verify
                </Button>
              </div>
            </form>
          )}

          {step === "edit" && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
                ⏱️ Session expires in: {Math.floor(otpTimer / 60)}:
                {(otpTimer % 60).toString().padStart(2, "0")}
              </p>

              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <Input
                label="WhatsApp Number"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsapp: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
              />
              <Input
                label="Vehicle Number"
                value={formData.vehicle_no}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicle_no: e.target.value.toUpperCase(),
                  })
                }
                required
              />
              <Select
                label="Vehicle Type"
                value={formData.vehicle_type}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_type: e.target.value })
                }
                options={[
                  { value: "car", label: "Car" },
                  { value: "bike", label: "Bike" },
                  { value: "scooter", label: "Scooter" },
                  { value: "other", label: "Other" },
                ]}
                required
              />
              <Input
                label="Emergency Contact 1"
                type="tel"
                value={formData.emergency_contact_1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergency_contact_1: e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10),
                  })
                }
                required
              />
              <Input
                label="Emergency Contact 2"
                type="tel"
                value={formData.emergency_contact_2}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergency_contact_2: e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10),
                  })
                }
              />
              <Textarea
                label="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/tag/${tagId}`)}
                  className="flex-1 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? "Updating..." : "Update Details"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
