import express from "express";

const Userrouter = express.Router();
import { Register, Login } from "../Controller/User.Controller";

Userrouter.post("/register", Register);
Userrouter.post("/login", Login);

export { Userrouter };
