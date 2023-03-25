const {AuthenticationError} = require("apollo-server")
const jwt = require("jsonwebtoken")

// this function isn't used 
exports.verify = (header) => {
  // context = { ... headers }
  const authHeader = context.req.headers.authorization
  if(authHeader) {
    // Bearer ...token
    const token = authHeader.split('Bearer ')[1]
    if(token) {
      try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return user
      } catch(err) {
        throw new AuthenticationError("Invalid/Expired token")
      }
    }
    throw new Error("Authentication token must be 'Bearer token' ")
  }
  throw new Error("Authentication token is required ")
}

