import Jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // This handles cases like "Bearer <token>"

  // If the token is missing, return an error response
  if (!token) {
    return res.status(401).json({
      message: "User is not authenticated",
      success: false,
    });
  }

  try {
    // Verify the token using the SECRET_KEY from your environment variables
    const decode = await Jwt.verify(token, process.env.SECRET_KEY);

    // If the token is invalid (expired, tampered with, etc.), return an error response
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Attach the userId (or other data) from the decoded token to the request object
    req.id = decode.userId;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // Catch any errors thrown by Jwt.verify (e.g., invalid token, expired token, etc.)
    console.error('JWT Error:', err.message);
    return res.status(401).json({
      message: "Invalid token",
      success: false,
      error: err.message, // Optional: you can return the error message for debugging
    });
  }
};

export default isAuthenticated;
