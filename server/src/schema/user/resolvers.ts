import jwt from "jsonwebtoken"
import { GraphQLError } from "graphql"
import {  } from "@apollo/server"
import { ApolloServerErrorCode } from '@apollo/server/errors';
import bcrypt from "bcrypt"
import { refreshTokens, users } from "../../db"
import { generateAToken, generateRToken, verifyToken } from "../../utils/token";

export const userResolvers = {
  Query: {
    users: () => {
      return users;
    },
    user: (parent, args, contextValue, info) => {
      return users.find((user) => user.id === args.id);
    }
  },
  Mutation: {
    userRegister: async (parent, args, contextValue, info) => {
       const reqUser = args.user;

       console.log(reqUser.username);

       // check if user already exists
       const foundUser = users.find((user) => user.username===reqUser.username);

       const newID = generateID();
       
       // create tokens
       const accessToken = generateAToken({ id: newID });
       const refreshToken = generateRToken({ id: newID});
       
       // save user
       if(foundUser) {
         throw new GraphQLError("username already exists", {
           extensions: {
             code: ApolloServerErrorCode.BAD_REQUEST
           }
         });
       } else {
         await bcrypt.hash(reqUser.password, 10).then((hashedPass) => {
           users.push({...reqUser, password: hashedPass, id: newID});
           refreshTokens.push(refreshToken);
         })
       }
      //  console.log({user:{...reqUser, loginCount:0}})
       return {user:{...reqUser, loginCount:0}, accessToken, refreshToken};
    },

    userLogin: async (parent, args) => {
      const reqUser = args.user;
      // console.log(args)
      // find user with same username
      const foundUser = users.find((user) => user.username===reqUser.username);

      if(foundUser) {
        // returns found user with token if password is correct
        const user = await bcrypt.compare(reqUser.password, foundUser.password).then((match) => {
          if(!match) {
            throw new GraphQLError("password is incorrect", {
              extensions: {
                code: ApolloServerErrorCode.BAD_REQUEST,
              }
            });
          }
          return {...foundUser};
        })

        // update logins count for this user
        foundUser.loginCount += 1;

        // console.log(user)
        const accessToken = generateAToken({ id:foundUser.id });
        const refreshToken = generateRToken({ id:foundUser.id });

        return {...foundUser, accessToken, refreshToken};
      } else {  
        // if user does not exists
        throw new GraphQLError("user doesn't exists", {
          extensions: {
            code: ApolloServerErrorCode.BAD_REQUEST
          }
        })
      }
    },
     
    refreshToken: async (parent, args) => {
      // console.log(args)
      if(refreshTokens.includes(args.token)) {
        const {id} = verifyToken(args.token)
        return { accessToken: generateAToken({id}) }
      }
    }
  }
}

const generateID = () => {
  return new Date().getTime().toString(36)
}
