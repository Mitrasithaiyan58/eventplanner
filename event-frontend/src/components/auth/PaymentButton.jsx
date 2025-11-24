import React from "react";
import axios from "../../axiosConfig"; // make sure this points to your Axios instance

export default function PaymentButton({ type, bookingId, amount, onSuccess }) {

  const startPayment = async () => {
    try {
      // 1️⃣ Create order on backend
      const createBody = bookingId ? { type, bookingId } : { type, amount };
      const createResp = await axios.post("/api/payment/createOrder", createBody);
      const order = createResp.data;

      // 2️⃣ Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_a3f5sWMg2JyJYy",
        amount: order.amount, // in paise
        currency: order.currency || "INR",
        name: type === "EVENT" ? "Event Booking" : "Vendor Booking",
        description: `${type} Payment`,
        order_id: order.orderId,
        handler: async function (response) {
          try {
            // 3️⃣ Update backend payment status
            await axios.post(`/api/payment/update-status/${bookingId}`, {
              paymentId: response.razorpay_payment_id
            });

            if (onSuccess) onSuccess(response);
            alert("Payment successful!");
          } catch (err) {
            console.error("Post-payment update error:", err);
            alert("Payment succeeded but updating booking failed.");
          }
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#528FF0" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Payment failed:", response);
        alert("Payment failed: " + (response.error?.description || "Unknown error"));
      });

      rzp.open();

    } catch (err) {
      console.error("Create order error:", err);
      alert("Could not start payment. Check console.");
    }
  };

  return (
    <button onClick={startPayment} className="btn btn-primary">
      Pay ₹{amount}
    </button>
  );
}
