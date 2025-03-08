import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from '../utils/apiError.js'
import { Book } from '../models/book.model.js'
import { apiResponse } from "../utils/apiResponse.js";



const addBook = asyncHandler( async(req, res) => {
    //get book details from frontend
    //validation - not empty
    //check if book already exists : title 
    //create book object - create entry in db
    //check for book entry
    //return response


    const {title, author, genre, rating} = req.body


    if(!title) {
        throw new apiError(400, "title is required")
    }
    if(!genre) {
        throw new apiError(400, "genre is required")
    }
    if(!author) {
        throw new apiError(400, "author is required")
    }



    const existedBook = await Book.findOne({
        title: title.toLowerCase()  // ✅ Case-insensitive check
    });
    
    if(existedBook){
        throw new apiError(409, "Book with title already exist")
    }



    const book = await Book.create({
        title,
        author,
        genre,
        rating: rating || 0
    })


    if(!book){
        throw new apiError(500, "Something went wrong while adding a new book")
    }


    return res.status(201).json(
        new apiResponse(200, book, "Book Added Successfully")
    )


} )



// const getSpecificBook = asyncHandler( async (req, res) => {
//     //req body -> data (title)
//     //check title not empty
//     //find the book
//     //check if it exists
//     //return response


//     const{ title } = req.body
//     if(!title){
//         throw new apiError(400, "Title is required")
//     }
    
//     const book = await Book.findOne({
//         title
//     })
//     if(!book) {
//         throw new apiError(400, "Book does not exist")
//     }

    

//     const gotBook = await Book.findById(book._id)

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
//                 book: gotBook
//             },
//             "Book found"
//         )
//     )

// })






const getBookByGenre = asyncHandler( async (req, res) => {
    //req body -> data (genre)
    //check genre not empty
    //find all the books
    //check if it exists
    //return response


    const{ genre } = req.body
    if(!genre){
        throw new apiError(400, "Genre is required")
    }
    
    const books = await Book.find({ 
        genre: genre.toLowerCase()
    });

    if(!books.length) {
        throw new apiError(400, "Book with the given genre does not exist")
    }


    // const options = {
    //     httpOnly: true,
    //     secure: true
    // }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            {
                books
            },
            "Books with given genre found"
        )
    )

})


const getBookByRating = asyncHandler( async (req, res) => {
    //find all the books with ratings>4.5
    //check if it exists
    //return response


    
    const books = await Book.find({ 
        rating: { $gt: 4.5 } // $gt means "greater than"
    });

    if(!books.length) {
        throw new apiError(400, "Book with rating above 4.5 does not exist")
    }



    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            {
                books
            },
            "Books with ratings above 4.5 found"
        )
    )

})


const getBookById = asyncHandler( async (req, res) => {
    const {id} = req.params;

    const book = await Book.findById(id).select("-password")

    if(!book) {
        throw new apiError(400, "something went wrong")
    }

    return res
    .status(201)
    .json(
        new apiResponse(200, book, "Book found successfully")
    )

    
})


export {
    addBook,
    getBookByGenre,
    getBookByRating,
    getBookById
}