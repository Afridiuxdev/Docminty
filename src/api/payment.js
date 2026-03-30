import client from "./client";

export const paymentApi = {
  createOrder: (planType) => client.post("/payment/create-order", { planType }),
  verify:      (data)     => client.post("/payment/verify", data),
};

export function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiatePayment(planType, onSuccess, onError) {
  try {
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error("Razorpay failed to load");

    const res  = await paymentApi.createOrder(planType);
    const data = res.data.data;

    const options = {
      key:         data.keyId,
      amount:      data.amount,
      currency:    data.currency,
      order_id:    data.orderId,
      name:        "DocMinty",
      description: planType === "MONTHLY_PRO" ? "Business Pro Monthly" : "Business Pro Annual",
      image:       "/favicon.ico",
      prefill: {
        name:  data.userName,
        email: data.userEmail,
      },
      theme: { color: "#0D9488" },
      handler: async (response) => {
        try {
          await paymentApi.verify({
            razorpayOrderId:   response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          if (onSuccess) onSuccess();
        } catch (e) {
          if (onError) onError(e.response?.data?.message || "Verification failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => { if (onError) onError("Payment failed"); });
    rzp.open();
  } catch (e) {
    if (onError) onError(e.message);
  }
}
