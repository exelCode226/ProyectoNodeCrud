import { Router } from "express";
import bookModels from "../models/book.models.js";
import { getBookById, getBooks, postBook } from "../controllers/book.controller.js";

const  router = Router();

//Middleware

//Obtener todos los libros [GET ALL]
router.get('/books',getBooks);

//Crear un nuevo libro (recurso) [POST]

router.post('/book',postBook);

router.get('/book/:id',getBookById);


export default router