import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy} from "passport-jwt";

import { usersService } from "../Managers/index.js";
import AuthService from "../Services/AuthService.js";

const initializePassportConfig = () =>{
    passport.use('register', new LocalStrategy({usernameField:'email',passReqToCallback:true},async (req,email,password,done)=>{
        const {first_name,last_name,age,cart,role} = req.body;
        if(!first_name||!last_name||!age||!cart){
            return done(null,false,{message:'Missing values'});
        }
        if((role!="user")&&(role!="admin")&&(role!=null)){
            return done(null,false,{message:'Invalid values'});
        }
        const user = await usersService.getUserByEmail(email);
        if(user){
            return done(null,false,{message:"User already exists"});
        };
        const authService = new AuthService()
        const hashedPassword = await authService.hashPassword(password);
        const User = {
            first_name,
            last_name,
            email,
            age,
            password:hashedPassword,
            cart,
            role:role||"user"
        }
        const result = await usersService.createUser(User);
        return done(null,result);
    }));

    passport.use('login', new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
        const user = await usersService.getUserByEmail(email);
        if(!user){
            return done(null,false,{message:"Incorrect values"});
        };
        const authService = new AuthService();
        const validation = await authService.validatePassword(password,user.password);
        if(!validation){
            return done(null,false,{message:"Incorrect values"});
        }
        return done(null,user);
    }));

    passport.use('current',new JWTStrategy({
        secretOrKey:'nashee',
        jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor])
    },async(payload,done)=>{
        return done(null,payload);
    }));
}


function cookieExtractor(req){
    return req?.cookies?.['jwt'];
}

export default initializePassportConfig;