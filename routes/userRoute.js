import express from "express";
import { addproduct,listProductCategory,login, logout, register, singleProduct } from "../controller/userController.js";
const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/add-product').post(addproduct)
router.route('/all-p').get(listProductCategory)
router.route('/cake/:id').get(singleProduct)

export default router;