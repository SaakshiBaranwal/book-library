import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from '../utils/apiError.js'
import { Book } from '../models/book.model.js'
// import uploadOnCloudinary from '../utils/cloudinary.js'
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshTokens = async(userId) => 
{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating refresh and access token")
    }
}



// const addBook = asyncHandler( async(req, res) => {
//     //get book details from frontend
//     //validation - not empty
//     //check if book already exists : title 
//     //create book object - create entry in db
//     //check for book entry
//     //return response


//     const {title, author, genre, rating} = req.body


//     if(!title) {
//         throw new apiError(400, "title is required")
//     }
//     if(!genre) {
//         throw new apiError(400, "genre is required")
//     }
//     if(!author) {
//         throw new apiError(400, "author is required")
//     }



//     const existedBook = await Book.findOne({
//         title: title.toLowerCase()  // ✅ Case-insensitive check
//     });
    
//     if(existedBook){
//         throw new apiError(409, "Book with title already exist")
//     }



//     const book = await Book.create({
//         title,
//         author,
//         genre,
//         rating: rating || 0
//     })


//     if(!book){
//         throw new apiError(500, "Something went wrong while adding a new book")
//     }


//     return res.status(201).json(
//         new apiResponse(200, book, "Book Added Successfully")
//     )


// } )



// // const getSpecificBook = asyncHandler( async (req, res) => {
// //     //req body -> data (title)
// //     //check title not empty
// //     //find the book
// //     //check if it exists
// //     //return response


// //     const{ title } = req.body
// //     if(!title){
// //         throw new apiError(400, "Title is required")
// //     }
    
// //     const book = await Book.findOne({
// //         title
// //     })
// //     if(!book) {
// //         throw new apiError(400, "Book does not exist")
// //     }

    

// //     const gotBook = await Book.findById(book._id)

// //     // const options = {
// //     //     httpOnly: true,
// //     //     secure: true
// //     // }

// //     return res
// //     .status(200)
// //     .json(
// //         new apiResponse(
// //             200,
// //             {
// //                 book: gotBook
// //             },
// //             "Book found"
// //         )
// //     )

// // })






// const getBookByGenre = asyncHandler( async (req, res) => {
//     //req body -> data (genre)
//     //check genre not empty
//     //find all the books
//     //check if it exists
//     //return response


//     const{ genre } = req.body
//     if(!genre){
//         throw new apiError(400, "Genre is required")
//     }
    
//     const books = await Book.find({ 
//         genre: genre.toLowerCase()
//     });

//     if(!books.length) {
//         throw new apiError(400, "Book with the given genre does not exist")
//     }


//     // const options = {
//     //     httpOnly: true,
//     //     secure: true
//     // }

//     return res
//     .status(200)
//     .json(
//         new apiResponse(
//             200,
//             {
//                 books
//             },
//             "Books with given genre found"
//         )
//     )

// })


// const getBookByRating = asyncHandler( async (req, res) => {
//     //find all the books with ratings>4.5
//     //check if it exists
//     //return response


    
//     const books = await Book.find({ 
//         rating: { $gt: 4.5 } // $gt means "greater than"
//     });

//     if(!books.length) {
//         throw new apiError(400, "Book with rating above 4.5 does not exist")
//     }



//     return res
//     .status(200)
//     .json(
//         new apiResponse(
//             200,
//             {
//                 books
//             },
//             "Books with ratings above 4.5 found"
//         )
//     )

// })


// const getBookById = asyncHandler( async (req, res) => {
//     const {id} = req.params;

//     const book = await Book.findById(id).select("-password")

//     if(!book) {
//         throw new apiError(400, "something went wrong")
//     }

//     return res
//     .status(201)
//     .json(
//         new apiResponse(200, book, "Book found successfully")
//     )

    
// })


const registerUser = asyncHandler( async(req, res) => {
    //get user details from frontend
    //validation - not empty
    //check if user already exists : username and email
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response


    const {username, password} = req.body
    
    if(!username ) {
        throw new apiError(400, "Username is required")
    }
    if(!password ) {
        throw new apiError(400, "Password is required")
    }



    const existedUser = await User.findOne({
        username 
    })
    if(existedUser){
        throw new apiError(409, "User with this username already exist")
    }



    const user = await User.create({
        username,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiError(500, "Something went wrong while registering the user")
    }


    return res.status(201).json(
        new apiResponse(200, createdUser, "User Registered Successfully")
    )



} )


const loginUser = asyncHandler( async (req, res) => {
    //req body -> data
    //check username or email not empty
    //find the user
    //check password
    //access and refresh token
    //send cookie
    //send response


    const{username, password} = req.body
    if(!username){
        throw new apiError(400, "username is required")
    }
    
    const user = await User.findOne({
        username
    })
    if(!user) {
        throw new apiError(400, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new apiError(401, "Password not valid")
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
        
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.
    status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out"))


})








export {
    registerUser,
    loginUser,
    logoutUser
}
