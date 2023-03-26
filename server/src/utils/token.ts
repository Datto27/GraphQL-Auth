import jwt from "jsonwebtoken"

export const generateAToken = (payload: {id:string}) => {
  const token = jwt.sign(
    payload, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" } 
  )
  return token
}

export const generateRToken = (payload: {id:string}) => {
  const token = jwt.sign(
    payload, 
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "365d" } 
  )
  return token
}

export const verifyToken = (token:string) => {
  const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
  // console.log(decode)
  return decode
}
