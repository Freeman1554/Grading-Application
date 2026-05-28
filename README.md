# ACADEMIC GRADING PERFORMANCE APP
A student grading App is a structured system used to evaluate a student’s academic performance based on their scores or marks in a subject, assignment, test, or examination.
The logic works by defining score ranges and assigning corresponding grades and performance statuses to each range. 

For example, a score between 80 and 100 may be assigned grade “A” to represent excellent performance, scores from 60 to 79 may receive grade “B” for good performance, while scores from 50 to 59 may receive grade “C” indicating average performance.

Any score below 50 may be marked as “Failed,” showing that the student did not meet the minimum academic requirement. In many systems, the grading logic also determines whether a student passes or fails by assigning a Boolean value such as isPass = true for passing grades and isPass = false for failing grades. 

This logic is implemented in this backend applications using conditional statements like if, else if, and else, where the system checks the student’s score and automatically calculates the appropriate grade and pass status before storing the result in a database. The purpose of grading logic is to ensure fairness, consistency, automation, and easier analysis of student performance across different academic records.

## Requirements
- Database - Mongodb - ATLAS
- Error handling
- Middleware
- CORS
- Validator - joi
- Logs
- Backend - Express, Nodejs

## Requirements to be included
- Authentication: Bcrypt, jsonwebtoken
- Email service: nodemailer
- Logging: FS or Pino 
- External API: axios or fetch
- Frontend and Backend Connection: react-native
-  Caching: redis
- Websockets: socket.io node http
- Testing: jest
- Database - sequelize and mysql2

## API ENDPOINTS
- localhost:3001/todos(GET Method)
- http://localhost:2002/student(GET Method)
- http://localhost:2002/student/?grade=B(GET Method by query)
- http://localhost:2002/student/?isPass=true(GET Method by query)
- http://localhost:2002/student/?isPass=false(GET Method by query)
- http://localhost:2002/student(POST Method)
- http://localhost:2002/student/6a170ee913c939110a5d0bd6(PATCH Method by :_id)
- http://localhost:2002/student/6a170ee913c939110a5d0bd6(DELETE Method by :_id)
