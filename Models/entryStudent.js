const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    classLevel: {
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    score:{
        type: Number,
        required: true
    },
    grade:{
        type: String,
    },
    isPass:{
        type: String,
    }
}, {timestamps: true},
)

const entryModel = mongoose.model("entry_student", studentSchema)

module.exports = entryModel;