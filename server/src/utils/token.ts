import jwt from "jsonwebtoken"

export const generateAToken = (payload) => {
  const token = jwt.sign(
    payload, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" } 
  )
  return token
}

export const generateRToken = (payload) => {
  const token = jwt.sign(
    payload, 
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "365d" } 
  )
  return token
}
