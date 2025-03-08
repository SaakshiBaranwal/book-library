import mongoose, {Schema} from "mongoose";
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'


const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            index: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,  
            index: true      
        },
        genre: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        rating: {
            type: Number, 
            default: 0,
            min: 0,        
            max: 5, 
        },
        
    },
        {
            timestamps:true
        }
    

)



export const Book = mongoose.model("Book", bookSchema)