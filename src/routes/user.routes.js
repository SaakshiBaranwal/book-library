import { Router } from "express";
import {registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { addBook, getBookByGenre, getBookByRating,  getBookById} from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()




//BOOK

// router.route("/add").post(verifyJWT, addBook)
router.route("/add").post(addBook)

// router.route("/searchByTitle").post(getSpecificBook)
router.route("/getBook/:id").get(getBookById)


router.route("/searchByGenre").post(getBookByGenre)

router.route("/searchByRatings").post(getBookByRating)


//USER

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)
//this is not working




export default router