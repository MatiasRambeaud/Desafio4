import express from "express";
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import __dirname from './utils.js';
import CartsRouter from "./Routes/carts.router.js"
import ProductsRouter from "./Routes/products.router.js";
import SessionsRouter from "./Routes/SessionsRouter.js";
import initializePassportConfig from './Config/passport.config.js';

const app = express();
const PORT = process.env.PORT||8080;
app.listen(PORT, ()=>console.log("server running."));

const connection = mongoose.connect("mongodb+srv://matiasrambeaud:matirambo@matiasrambeaudcluster1.6s4g2lt.mongodb.net/store?retryWrites=true&w=majority&appName=MatiasRambeaudCluster1")

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

initializePassportConfig();
app.use(passport.initialize());

app.use("/api/sessions",SessionsRouter);
app.use("/api/products",ProductsRouter);
app.use("/api/cart",CartsRouter)