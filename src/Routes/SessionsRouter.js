import jwt from "jsonwebtoken";

import { passportCall } from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";

class SessionsRouter extends BaseRouter {
    init(){
        this.post("/register",["PUBLIC"],passportCall("register"),(req,res)=>{
            res.sendSuccess("successfully registered");
        })
        this.post("/login",["PUBLIC"],passportCall("login"),(req,res)=>{
            const sessionUser = {
                name:`${req.user.first_name} ${req.user.last_name}`,
                cart:req.user.cart,
                role:req.user.role,
                id:req.user._id
            }
            const token = jwt.sign(sessionUser,"nashee",{expiresIn:"10d"});
            res.cookie("jwt",token).sendSuccess("logged in");
        })
        this.get("/current",["PUBLIC"],passportCall("current"),(req,res)=>{
            if(req.user){
                res.sendSuccess(req.user);
            }else{
                res.sendUnauthorized("need to log in first");
            }
        })
    }
}

const sessionsRouter = new SessionsRouter();
export default sessionsRouter.getRouter();