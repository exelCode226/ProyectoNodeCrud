import { getBookById } from "../controllers/book.controller.js";


describe('bookController.getBookById', () => {
    it('deberia retornar un error 400 si el ID es invalido', async () => {
        const req = { params: { id: 'invalidID' } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        await getBookById(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "ID no valido" })
    });


})