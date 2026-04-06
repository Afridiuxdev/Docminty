"use client";
import { useCallback } from "react";
import { api } from "@/api/client";
import toast from "react-hot-toast";

export function useRazorpay() {
    const loadScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const initiatePayment = useCallback(async ({ amount, plan, onSuccess }) => {
        const loaded = await loadScript();
        if (!loaded) {
            toast.error("Payment gateway failed to load. Try again.");
            return;
        }

        try {
            const { data } = await api.createOrder({ amount, plan });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: "INR",
                name: "DocMinty",
                description: `${plan} Plan`,
                order_id: data.orderId,
                handler: async (response) => {
                    try {
                        await api.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        toast.success("Payment successful! 🎉");
                        onSuccess?.();
                    } catch {
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: { name: "", email: "", contact: "" },
                theme: { color: "#4F46E5" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            toast.error("Failed to initiate payment.");
        }
    }, []);

    return { initiatePayment };
}