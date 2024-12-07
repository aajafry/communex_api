# CommuneX - Backend 💬

This is the **backend** for **CommuneX**, a real-time chat application built using Node.js, Express, MongoDB, and Socket.IO.

## 🚀 Features

- **User Authentication**: Secure login, signup, and logout using JWT and bcrypt.
- **Socket.IO Integration**: Real-time message broadcasting.
- **RESTful API**: CRUD operations for users, groups, and messages.
- **Rate Limiting**: Protects against brute-force attacks.
- **Cookie-Based Sessions**: Secure HTTP-only cookies for authentication.

## 🛠️ Tech Stack

- **Node.js**: Server runtime.
- **Express.js**: Web framework.
- **MongoDB (Mongoose)**: Database for storing chat data.
- **Socket.IO**: Real-time communication.
- **Bcrypt**: Password hashing.
- **JWT**: Token-based authentication.
- **Cookie-Parser**: Middleware for parsing cookies.
- **Express-Rate-Limit**: Prevent abuse.
- **Helmet**: Security headers.
- **Cloudinary**: Image management.
  and more.

## 📦 Installation

1. Clone the repository:

```bash
    git clone https://github.com/aajafry/communex_api.git
```

2.Install dependencies:

```bash
    npm install
```

3. Set up environment variables: Create a `.env` file in the root directory:

```env
    PORT=3000
    NODE_ENV=(set `production` || `development`)
    CORS_ORIGIN=http://localhost:5173
    DB_ENDPOINT=mongodb://localhost:27017/communex
    JWT_SECRET=(your secret key)CLOUDINARY_CLOUD_NAME=(set your cloudinary cloud name)
    CLOUDINARY_API_KEY=(set your cloudinary cloud API key)
    CLOUDINARY_API_SECRET=(set your cloudinary API secret)
```

4. Run the server:

```bash
    npm run dev
```

5. The server will run at:

```arduino
    http://localhost:3000
```

## 📜 API Documentation

The backend provides the following RESTful APIs:

#### Authentication

| Route          | Method | Description       |
| -------------- | ------ | ----------------- |
| `/auth/signup` | POST   | User registration |
| `/auth/login`  | POST   | User login        |
| `/auth/logout` | POST   | User logout       |

#### User Management

| Route          | Method | Description         |
| -------------- | ------ | ------------------- |
| `/user/me`     | GET    | Get user details    |
| `/user/users`  | GET    | Get all users       |
| `/user/update` | PUT    | Update user profile |
| `/user/delete` | DELETE | Delete user profile |

#### Group Management

| Route                     | Method | Description               |
| ------------------------- | ------ | ------------------------- |
| `/group/create`           | POST   | Create a group            |
| `/group/getUserGroups`    | GET    | Get all groups for user   |
| `/group/getGroupMessages` | POST   | get all messages of group |

#### Messages Management

| Route               | Method | Description             |
| ------------------- | ------ | ----------------------- |
| `/message/messages` | POST   | get all message of user |

#### cloudinary Management

| Route                      | Method | Description                    |
| -------------------------- | ------ | ------------------------------ |
| `/cloudinary/delete-image` | POST   | delete image from `cloudinary` |

## 🔗 Frontend Integration

The `CommuneX Frontend` repository can be found [here](https://github.com/aajafry/communex.git). To run the project end-to-end:

1. Clone and set up the frontend repository.
2. Ensure the backend server is running.
3. Update the backend URL in the frontend .env file.
4. Start both servers (frontend and backend) to test the integration.
