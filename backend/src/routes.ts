import express from "express";

import multer from "multer";
import multerConfig from "./config/multer";
import ItemsController from "./controllers/ItemsController";
import PointsController from "./controllers/PointsController";

import { Joi, celebrate } from "celebrate";

const routes = express()

const upload = multer(multerConfig)

const pC = new PointsController()
const iC = new ItemsController()

// index, show, create, update, delete
routes.get('/items', iC.index)

routes.get('/points/:id', pC.show)
routes.get('/points', pC.index)
routes.post('/points', upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }, {
        // Validação inteira
        abortEarly: false
    }), pC.create)

export default routes