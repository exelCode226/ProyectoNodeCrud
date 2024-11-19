import mongoose from "mongoose";
import bookModels from "../models/book.models.js";


export const getBooks = async (req, res, next) => {
    try {
        const Book = await bookModels.find()
        if (Book.length === 0) {
            return res.status(204).json([])
        }
        res.status(200).json({ message: Book })
    } catch (error) {
        next(error)
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
export const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, genre, publication_date } = req.body;

    try {
        // Validar el ID proporcionado
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "El ID proporcionado no es válido." });
        }

        // Validar que los campos requeridos no estén vacíos
        if (!title || !author || !genre || !publication_date) {
            return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
        }

        // Verificar si el libro existe
        const existingBook = await bookModels.findById(id);
        if (!existingBook) {
            return res.status(404).json({ success: false, message: "No se encontró el libro con el ID proporcionado." });
        }

        // Actualizar el libro
        const updatedBook = await bookModels.findByIdAndUpdate(
            id,
            { title, author, genre, publication_date },
            { new: true } // Devolver el documento actualizado
        );

        // Responder con éxito
        return res.status(200).json({
            success: true,
            message: `El libro '${updatedBook.title}' fue actualizado con éxito.`,
            book: updatedBook,
        });
    } catch (error) {
        console.error("Error al actualizar el libro:", error);
        return res.status(500).json({ success: false, message: "Error en el servidor." });
    }
};

export const deleteBook = async (req, res, next) => {
    const { id } = req.params;

    // Validación del ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "El ID proporcionado no es válido."
        });
    }

    try {
        // Buscar y eliminar el libro
        const deletedBook = await bookModels.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: "El libro no existe."
            });
        }

        // Respuesta de éxito
        return res.status(200).json({
            success: true,
            message: `El libro "${deletedBook.title}" ha sido eliminado correctamente.`,
        });

    } catch (error) {
        // Manejo de errores del servidor
        next(error);
    }
};
