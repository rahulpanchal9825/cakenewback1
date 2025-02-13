import express from "express";
import { addproduct,listProductAll,listProductCategory,login, logout, register } from "../controller/userController.js";
import isAuthenticated from "./../middleware/isAuthenicated.js";
const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/add-product').post(addproduct)
router.route('/all-p').get(listProductCategory)
// router.route('/all-p').get(listProductAll)


export default router;