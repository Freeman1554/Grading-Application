const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors");
const helmet = require("helmet")
const Limiter = require("express-rate-limit")
const logRequest = require("./Logs/loggers.js")
const {validateCreateEntry, validateUpdateEntry} = require("./Validation/validator.js");
const errorhandler = require("./Middleware/errorHandler.js");
const entry_student = require("./Models/entryStudent.js")
const connectDB = require("./Config/db.js");
const { default: mongoose } = require("mongoose");
dotenv.config();

const app = express();
const limiter = Limiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
}) 
const allowedOrigins = ["http://localhost:5173", "https://bwlgroup.com"];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); //Allow request with no origin(e.g mobile apps)
        } else {
            callback(new Error('Not allowed by CORS')); //Block other origins
        }
    }
}

// const corsOptions = {
//   origin: 'http://example.com',//add your frontend server ip
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

app.use(express.json());
app.use(helmet())
app.use(limiter)
app.use(logRequest)
app.use(cors(corsOptions));
connectDB();

const PORT = process.env.PORT || 2002



// app.get("/student", async (req, res, next) =>{
//     try {
//         //const{fullname} = req.query;
//         const allStudent = await entry_student.find({})
//         res.status(200).json(allStudent)
//     } catch (error) {
//         next(error)
//     }
// })

app.get("/student", async (req, res, next) => {

    try {

        const filter = {};

        if(req.query.fullname) {
            filter.fullname = req.query.fullname;
        }

        if (req.query.grade) {
            filter.grade = req.query.grade;
        }

        if (req.query.subject) {
            filter.subject = req.query.subject;
        }

        if (req.query.isPass) {
            filter.isPass = req.query.isPass === "true";
        }

        const students = await entry_student.find(filter);

        res.status(200).json(students);

    } catch (error) {
        next(error);
    }
});


app.get("/student/pass", async (req, res, next) => {
    try {
        const passed = await entry_student.find({isPass: true})
    if(passed.length === 0) return res.status(401).json({message: "No record found"});
    res.status(200).json(passed)
    } catch (error) {
        next(error)
    }
})

app.get("/student/fail", async (req, res, next) => {
    try {
        const failed = await entry_student.find({isPass: false})
    if(!failed) return res.status(401).json({message: "No record found"});
    res.status(200).json(failed)
    } catch (error) {
        next(error)
    }
})

app.get("/student/:id", async (req, res, next) =>{
    try {
        const{id} = req.params;
        const{subject} = req.query;
        const list = await entry_student.findById(id, subject)
    if(!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID")
    if(!list) return res.status(401).json({message: "User not found"});
    // res.send({list})
    res.status(200).json({id: id, subject: subject})
    } catch (error) {
        next(error)
    }
})


app.post("/student", validateCreateEntry, async (req, res, next) =>{

    try {
        const{fullname, classLevel, subject, score} = req.body;

    let grade;
    let isPass;

    if (score >=80){
        grade = "A";
        isPass = true;
    } else if (score >=60 && score <=79) {
        grade = "B";
        isPass = true;
    } else if (score >=50 && score <=59) {
        grade = "C";
        isPass = true;
    } else {
        grade = "Failed";
        isPass = false;
    }{
        
    }
    const newList = new entry_student({...req.body, grade, isPass});
    await newList.save()
    res.status(200).json(newList)
    } catch (error) {
        next(error)
    }

})


app.patch("/student/:id", validateUpdateEntry, async (req, res, next) => {
    try {
        const{id} = req.params
    // if(!mongoose.Types.ObjectId.isValid(id));
        const reNew = await entry_student.findByIdAndUpdate(id, req.body, {new: true});
    if(!reNew)
        return res.status(400).json({message: "User not found"});
    Object.assign(reNew, req.body);
    if(req.body.score !== undefined);
        const score = req.body.score;

    if (reNew.score >=80){
        reNew.grade = "A";
        reNew.isPass = true;
    } else if (reNew.score >=60 && reNew.score <=79) {
        reNew.grade = "B";
        reNew.isPass = true;
    } else if (reNew.score >=50 && reNew.score <=59) {
        reNew.grade = "C";
        reNew.isPass = true;
    } else {
        reNew.grade = "Failed";
        reNew.isPass = false;
    }{
        
    }
    await reNew.save()

    res.status(200).json({ reNew, message: "Update was successful"})
    } catch (error) {
        next(error)
    }
})

app.delete("/student/:id", async (req, res, next) =>{
    try {
        const{id} = req.params;
      const Student = await entry_student.findByIdAndDelete(id, req.body, {new: true})
    const entry = entry_student.length;
    if(!entry)
    // if(Student.length === entry) 
        return res.status(401).json({message: "User not found"});
    res.status(200).json({message: "User deleted successfully"})
    } catch (error) {
        next(error)
    }
})

app.use(errorhandler)

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})




// //Array while using heap memory(in memory-storage)
// let entry_student = [
//     {id: 1, nam:"Elizabeth", unit: "SS1", subject: "Maths", score: 68, isPass: true},
//     {id: 2, nam: "Bobby", unit:"SS1", subject: "Maths", score: 80, isPass: true}
// ]
// app.get("/student", (req, res, next) =>{
//     try {
//         res.status(200).json(entry_student)
//     } catch (error) {
//         next(error)
//     }
// })

// app.get("/students/pass", (req, res, next) => {
//     try {
//         const passed = entry_student.filter((entry_student) => entry_student.isPass === true)
//     if(!passed) return res.status(401).json({message: "No record found"});
//     res.status(200).json(passed)
//     } catch (error) {
//         next(error)
//     }
// })

// app.get("/students/fail", (req, res, next) => {
//     try {
//         const failed = entry_student.filter((entry_student) => entry_student.isPass === false)
//     if(failed) return res.status(401).json({message: "No record found"});
//     res.status(200).json(failed)
//     } catch (error) {
//         next(error)
//     }
// })

// app.get("/student/:id", (req, res, next) =>{
//     try {
//         const id = parseInt(req.params.id)
//     if(!NaN) throw new Error("Invalid ID")
//     const list = entry_student.find((entry_student) => entry_student.id === id)
//     if(!list) return res.status(401).json({message: "User not found"});
//     res.status(200).json(list)
//     } catch (error) {
//         next(error)
//     }
// })

// app.post("/student", validateCreateEntry, (req, res, next) =>{

//     try {
//         const{nam, unit, subject, score} = req.body;

//     let grade;
//     let isPass;

//     if (score >=80){
//         grade = "A";
//         isPass = true;
//     } else if (score >=60 && score <=79) {
//         grade = "B";
//         isPass = true;
//     } else if (score >=50 && score <=59) {
//         grade = "C";
//         isPass = true;
//     } else {
//         grade = "Failed";
//         isPass = false;
//     }{
        
//     }
//     const newList = {id: entry_student.length +1, ...req.body, grade, isPass};
//     entry_student.push(newList);
//     res.status(200).json(newList)
//     } catch (error) {
//         next(error)
//     }

// })

// app.patch("/student/:id", validateUpdateEntry, (req, res, next) => {
//     try {
//         const id = parseInt(req.params.id);
//     reNew = entry_student.find((entry_student) => entry_student.id === id);
//     if(!reNew)
//         return res.status(400).json({message: "User not found"});
//     Object.assign(reNew, req.body);

//     if (reNew.score >=80){
//         reNew.grade = "A";
//         reNew.isPass = true;
//     } else if (reNew.score >=60 && reNew.score <=79) {
//         reNew.grade = "B";
//         reNew.isPass = true;
//     } else if (reNew.score >=50 && reNew.score <=59) {
//         reNew.grade = "C";
//         reNew.isPass = true;
//     } else {
//         reNew.grade = "Failed";
//         reNew.isPass = false;
//     }{
        
//     }

//     res.status(200).json({ reNew, message: "Update was successful"})
//     } catch (error) {
//         next(error)
//     }
// })

// app.delete("/student/:id", (req, res, next) =>{
//     try {
//         const id = parseInt(req.params.id);
//     const entry = entry_student.length;
//     entry_student = entry_student.filter((entry_student) => entry_student.id !== id)
//     if(entry_student.length === entry) 
//         return res.status(401).json({message: "User not found"});
//     res.status(200).json({message: "User deleted successfully"})
//     } catch (error) {
//         next(error)
//     }
// })

// app.use(errorhandler)

// app.listen(PORT, () => {
//     console.log(`Server is running on port http://localhost:${PORT}`)
// })