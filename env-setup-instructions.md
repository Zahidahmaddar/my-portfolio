# Environment Setup Instructions

To fix the login issue, you need to create a `.env.local` file in the root of your project with the following variables:

```
# MongoDB Connection String
MONGODB_URI=mongodb+srv://darzahid537:YOUR_ACTUAL_PASSWORD@cluster0.gdkciyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret for Authentication
JWT_SECRET=your_secure_jwt_secret_key_here

# Optional: Other environment variables
# NODE_ENV=development
```

Replace:
- `YOUR_ACTUAL_PASSWORD` with your actual MongoDB password
- `your_secure_jwt_secret_key_here` with a secure random string for JWT token signing

After creating this file, restart your Next.js development server.
