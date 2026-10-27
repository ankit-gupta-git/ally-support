import Razorpay from "razorpay";
import crypto from "crypto";

let client: Razorpay | null = null

// Server-only Razorpay client, created on first use so a missing key only breaks
// billing requests, not the whole build. The key secret must never reach the browser.
export function getRazorpay() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Please provide RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the environment variables")
    }
    if (!client) {
        client = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })
    }
    return client
}

// Razorpay signs `${order_id}|${payment_id}` with the key secret (HMAC-SHA256).
// Compare in constant time so the check doesn't leak timing information.
export function isValidPaymentSignature(orderId: string, paymentId: string, signature: string) {
    const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(String(signature));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}
