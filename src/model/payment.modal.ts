import mongoose, { model, Schema } from "mongoose";

interface IPayment {
    ownerId: string
    plan: "pro" | "enterprise"
    cycle: "monthly" | "annual"
    amount: number
    currency: string
    orderId: string
    paymentId?: string
    status: "created" | "paid"
    validUntil?: Date
}

const paymentSchema = new Schema<IPayment>({
    ownerId: {
        type: String,
        required: true,
        index: true
    },
    plan: {
        type: String,
        enum: ["pro", "enterprise"],
        required: true
    },
    cycle: {
        type: String,
        enum: ["monthly", "annual"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    paymentId: {
        type: String,
    },
    status: {
        type: String,
        enum: ["created", "paid"],
        default: "created"
    },
    validUntil: {
        type: Date,
    }
}, { timestamps: true })

const Payment = mongoose.models.Payment || model('Payment', paymentSchema)

export default Payment
