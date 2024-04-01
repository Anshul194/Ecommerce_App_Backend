import express from 'express'
 import {router} from './src/Router/admin.route'
 import {Userrouter} from './src/Router/User.route'
 import {AdminServicerouter} from './src/Router/Admin.service.route'
 import {sellerServiceRoute} from './src/Router/Seller.Service.Route'
 import { OrderRouter } from './src/Router/Order.Router'
 import multer from 'multer';
 import dotenv from 'dotenv';
import bodyParser from 'body-parser'
dotenv.config();
const app=express();
app.use(express.json())
const upload = multer({ dest: 'uploads/' });
app.use(upload.array('image'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Port=5001;

app.listen(Port,()=>{
    console.log('Server is running on port ',Port);
})
app.use('/admin',router)
app.use('/user',Userrouter)
app.use('/',AdminServicerouter)
app.use('/',sellerServiceRoute);
app.use('/',OrderRouter)
//app.use('/',SellerServicerouter)