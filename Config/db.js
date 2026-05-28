const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongodB connected");
    } catch (error) {
        console.log("DB connection Failed", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;