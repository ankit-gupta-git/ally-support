import { connect } from "mongoose";

const mongo_url = process.env.MONGODB_URL;
if (!mongo_url) {
    throw new Error("Please provide MONGODB_URL in the environment variables");
}

let cache = global.mongoose
if (!cache) {
    cache = global.mongoose = { conn: null, promise: null }
}

if (!cache.promise) {
    cache.promise = connect(mongo_url!).then((c) => c.connection)
}

const connectDB = async () => {
    if (cache.conn) {
        return cache.conn
    }
    try {
        cache.conn = await cache.promise
    } catch (error) {
        console.log(error)
        throw error
    }

    return cache.conn
}

export default connectDB
