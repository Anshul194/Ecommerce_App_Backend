import express from "express";

const AdminServicerouter=express.Router();
import { approveRequest,declineUser,UserListForApproval,UserList} from "../Controller/Admin.Service";

AdminServicerouter.patch('/approveUser', approveRequest);
AdminServicerouter.patch('/declineUser', declineUser);
AdminServicerouter.get('/pendingApproval',UserListForApproval)
AdminServicerouter.get('/list',UserList)

export {AdminServicerouter}