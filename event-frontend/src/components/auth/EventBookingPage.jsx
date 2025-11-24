import React from "react";
import axios from "../axiosConfig";

export default function PaymentButton({
  type, 
  bookingId, 
  amount, 
  userId, 
  eventId, 
  vendorId, 
  onSuccess
}) {
  // type = "EVENT" or "VENDOR"

  const startPayment = async () => {
    try {
      // -----------------------------------------
      // 1) CREATE RAZORPAY ORDER
      // -----------------------------------------
      // If bookingId is sent → backend will take amount from booking table.
      const createBody = bookingId 
        ? { type, bookingId } 
        : { type, amount };

      const createResp = await axios.post("/payments/createOrder", createBody);
      const order = createResp.data;

      if (!order || !order.orderId) {
        alert("Invalid order response from server.");
        console.error("Order response:", order);
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: order.amount,       // must be in paise
        currency: order.currency,   // INR
        name: type === "EVENT" ? "Event Booking" : "Vendor Booking",
        description: `${type} Payment`,
        order_id: order.orderId,    // ALWAYS USE THIS - FIXED ✔

        handler: async function (response) {
          try {
            // -----------------------------------------
            // 2) VERIFY SIGNATURE IN BACKEND
            // -----------------------------------------
            const verifyResp = await axios.post("/payments/verify", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              type,
              bookingId,
              userId,
              eventId,
              vendorId,
              amount
            });

            if (
              verifyResp.data !== true &&
              verifyResp.data?.status !== "success"
            ) {
              alert("Payment verification failed!");
              return;
            }

            // -----------------------------------------
            // 3) SAVE PAYMENT RECORD
            // -----------------------------------------
            await axios.post("/payments", {
              userId,
              eventId: eventId || null,
              vendorId: vendorId || null,
              amount,
              method: "RAZORPAY",
              status: "SUCCESS",
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });

            // -----------------------------------------
            // 4) CONFIRM BOOKING
            // -----------------------------------------
            if (type === "EVENT" && bookingId) {
              await axios.put(`/event-booking/${bookingId}/confirm`);
            }

            if (type === "VENDOR" && bookingId) {
              await axios.put(`/vendor-booking/${bookingId}/confirm`);
            }

            alert("🎉 Payment successful & booking confirmed!");

            if (onSuccess) onSuccess(response);
          } catch (err) {
            console.error("Error after payment:", err);
            alert("Unexpected error after payment.");
          }
        },

        // -----------------------------------------
        // OPTIONAL PREFILL
        // -----------------------------------------
        prefill: {
          name: "",
          email: "",
          contact: ""
        },

        theme: { color: "#528FF0" }
      };

      const rzp = new window.Razorpay(options);

      // -----------------------------------------
      // PAYMENT FAILED HANDLER
      // -----------------------------------------
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response);
        alert("Payment failed: " + response.error?.description);
      });

      rzp.open();

    } catch (err) {
      console.error("Create order error:", err);
      alert("Could not initiate payment.");
    }
  };

  return (
    <button onClick={startPayment} className="btn btn-primary">
      Pay ₹{amount}
    </button>
  );
}
