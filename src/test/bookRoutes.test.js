import request from 'supertest'
import app from '../index.js'
import mongoose from 'mongoose';
import bookModels from '../models/book.models.js';
//Simula la base de datos
jest.mock("../models/book.models.js")

//Se realiza el test del enpoint de un solo libro
describe('GET /api/book/:id', () => {
    //Se realiza la prueba para este error de status
    test('deberia retornar 404 si el libro no existe', async () => {
        const nonExistentId = new mongoose.Types.ObjectId()//Se crea un id aleatorio
        const response = await request(app).get(`/api/book/${nonExistentId}`)//Se realiza una peticion a el endpoint
        expect(response.status).toBe(404)//La respuesta que se espera del codigo de estado
        expect(response.body).toEqual({ message: "Libro no encontrado" })//la respuesta que se espera del cuerpo de la solicitud
    });

    test('deberia retornar 200 ya que trae el libro', async () => {
        //Aqui simulamos un id
        const existe = "6735fe7ccc909c30c95170f8"
        const expectedBook = {  // Objeto del libro que se espera
            _id: existe,
            title: "Título del libro",
            author: "Autor del libro",
            genre: "Género",
            year: 2021
        };
        // Mockear el método `findById` para que devuelva el libro simulado
        bookModels.findById.mockResolvedValue(expectedBook)

        const response = await request(app).get(`/api/book/${existe}`) // Esto simula que el libro se encuentra
        expect(response.status).toBe(200)
        expect(response.body).toEqual({ message: "Libro encontrado", book: expectedBook })
    });

    test('deberia retornar 500 si hay un error en el servidor', async () => {
        const invalidID = new mongoose.Types.ObjectId()
        const errorMessage = "Databade connection error"
        bookModels.findById = await jest.fn().mockRejectedValue(new Error(errorMessage))
        const response = await request(app).get(`/api/book/${invalidID}`)
        expect(response.status).toBe(500)
        expect(response.body).toEqual({ message: "Error en el servidor" })
    });
})

describe('GET /api/books', () => {
    test('deberia de devolver 204 si no hay libros', async () => {

        bookModels.find.mockResolvedValue([])

        const response = await request(app).get(`/api/books`)
        expect(response.status).toBe(204)
        expect(response.body).toEqual({});
    });

    test('deberia de devolver 200 y traer todos los libros', async () => {
        const mockBooks = [
            {
                _id: "1",
                title: "Exel",
                author: "pepe",
                genre: "fabri",
                publication_date: 2008
            }
            ,
            {
                _id: "1",
                title: "Exel",
                author: "pepe",
                genre: "fabri",
                publication_date: 2008
            }

        ]

        bookModels.find.mockResolvedValue(mockBooks)

        const response = await request(app).get(`/api/books`)
        expect(response.status).toBe(200)
        expect(response.body).toEqual({ message: mockBooks });
    });
})


describe('POST /api/book', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    test('Debería responder con un 201 y el cuerpo esperado cuando el libro es creado exitosamente', async () => {
        const newBookData = {
            title: "Exel",
            author: "pepe",
            genre: "fabri",
            publication_date: 2008
        };

        // Simular que el libro fue guardado correctamente
        const savedBook = { ...newBookData, _id: "mockedBookId" };
        bookModels.create = jest.fn().mockResolvedValue(savedBook);

        const response = await request(app)
            .post('/api/book')
            .send(newBookData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "Libro creado exitosamente",
            newBook: savedBook
        });
    });

    test('Debería responder con un 400 si faltan datos en la solicitud', async () => {
        const incompleteBookData = {
            title: "Exel",
            author: "pepe"
            // Falta genre y publication_date
        };

        const response = await request(app)
            .post('/api/book')
            .send(incompleteBookData);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Enviar todos los datos" });
    });

    test('Debería responder con un 500 si ocurre un error en el servidor', async () => {
        const newBookData = {
            title: "Exel",
            author: "pepe",
            genre: "fabri",
            publication_date: 2008
        };

        // Simular un error en el servidor
        bookModels.create = jest.fn().mockRejectedValue(new Error("Error en el servidor"));

        const response = await request(app)
            .post('/api/book')
            .send(newBookData);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Error en el servidor" });
    });
});

