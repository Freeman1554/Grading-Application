const Joi = require("joi");

 
const createEntry = Joi.object ({
        fullname: Joi.string().min(3).max(100).required(),
        classLevel: Joi.string().min(2).max(10).required(),
        subject: Joi.string().min(3).max(15).required(),
        score: Joi.number().min(0).max(100).required(),
    })


const updateEntry = Joi.object({
    fullname: Joi.string().min(3).max(100),
    classLevel: Joi.string().min(2).max(10),
    subject: Joi.string().min(3).max(15),
    score: Joi.number().min(0).max(100),
})

function validateCreateEntry(req, res, next){
        const {error, value} = createEntry.validate(req.body);
    if(error) {
        return res.status(400).json({error: error.details[0].message})
    }
      req.body = value  
      next();
    }

function validateUpdateEntry(req, res, next){
    const{error, value} = updateEntry.validate(req.body);
    if(error){
        return res.status(400).json({error: error.details[0].message})
    }
    req.body = value
    next();
}
  
        


module.exports = {validateCreateEntry, validateUpdateEntry}