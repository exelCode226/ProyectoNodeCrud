import mongoose from "mongoose";
import bookModels from "../models/book.models.js";


export const getBooks = async (req, res) => {
    try {
        const Book = await bookModels.find()
        if (Book.length === 0) {
            return res.status(204).json([])
        }
        res.status(200).json({ message: Book })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el ID es válido antes de buscar en la base de datos
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ "success": false, message: "ID no valido" });
        }

        const book = await bookModels.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        return res.status(200).json({ message: "Libro encontrado", book });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const postBook = async (req, res) => {
    try {
        const { title, author, genre, publication_date } = req.body;

        // Verificar que todos los campos requeridos estén presentes
        if (!title || !author || !genre || !publication_date) {
            return res.status(400).json({ message: "Enviar todos los datos" });
        }
        
        // Crear y guardar el nuevo libro
        const newBook = await bookModels.create({ title, author, genre, publication_date });

        return res.status(201).json({
            message: "Libro creado exitosamente",
            newBook
        });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};
