import express from "express";

const router=express.Router();
import { Register,Login } from "../Controller/admin.controller";

router.post('/register',Register);
router.post('/login',Login)

export {router}