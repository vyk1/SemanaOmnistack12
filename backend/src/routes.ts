import express from "express";

import ItemsController from "./controllers/ItemsController";
import PointsController from "./controllers/PointsController";

const routes = express()
const pC = new PointsController()
const iC = new ItemsController()

// index, show, create, update, delete
routes.get('/items', iC.index)
routes.post('/items', iC.create)

routes.get('/points/:id', pC.show)
routes.get('/points', pC.index)
routes.post('/points', pC.create)

export default routes