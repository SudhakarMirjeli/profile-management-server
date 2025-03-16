
# Profile Management Server

This is the backend server for the **Profile Management System**, built with **Node.js**, **Express.js**, and **MongoDB**. It provides RESTful APIs for user profile creation, retrieval, updating, and deletion.

## 🚀 Features
- User Authentication (AWS Cognito)
- CRUD operations for user profiles
- Secure API with JWT Authentication
- MongoDB as the database
- Deployed on AWS EC2 / AWS Lambda 

## 📌 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** AWS Cognito
- **Deployment:** AWS EC2 / AWS Lambda
- **Package Manager:** npm 

## 📂 Project Structure
```
profile-management-server/
├── src/
│   ├── controllers/    # API logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── middlewares/    # Authentication & Validation
│   ├── config/         # Environment configurations
│   ├── app.js          # Express app setup
├── .env                # Environment variables
├── package.json        # Dependencies & scripts
└── README.md           # Project documentation
```

## 🔧 Installation
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/SudhakarMirjeli/profile-management-server.git
cd profile-management-server
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory and add:
```
PORT=4001
MONGO_URL
AWS_S3_BUCKET_NAME
AWS_S3_ACCESS_KEY
AWS_S3_SECRET_KEY
AWS_REGION=ap-south-1
AWS_COGNITO_SECRET_KEY
AWS_COGNITO_DOMAIN
AWS_COGNITO_CLIENT_ID
CLIENT_SECRET
REDIRECT_URI=http://localhost:3000/auth/callback
```

### **4️⃣ Start the Server**
```bash
npm start
```
By default, the server runs on `http://localhost:4001`

## 🚀 API Endpoints
| Method | Endpoint           | Description                  |
|--------|-------------------|------------------------------|
| POST    | /profile         | Create user profile         |
| GET    | /profile/:id      | Get user profile            |
| PUT    | /profile/:id      | Update user profile         |
| DELETE | /profile/:id      | Delete user profile         |
| GET    | /profile          | Get all users profile       |
| GET    | /health-check     | Check server status         |

## 📦 Deployment
### **1️⃣ Deploy to AWS EC2**
```bash
scp -r . ec2-user@your-ec2-ip:/home/ec2-user/profile-management-server
ssh ec2-user@your-ec2-ip
cd profile-management-server
npm install
pm2 start src/app.js --name profile-server
pm2 save
```
---
