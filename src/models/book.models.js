import mongoose from "mongoose";

const bookSchemma=new mongoose.Schema({
    title:String,
    author:String,
    genre:String,
    publication_date:String
})

export default mongoose.model('Libro',bookSchemma,'Libros')