import { Request, Response } from 'express'
import knex from '../database/connection'

export default class ItemsController {

    async index(req: Request, res: Response) {
        const items = await knex('items').select('*')
        const host = 'http://localhost:3334/uploads/'
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: host + item.image,
            }
        })
        return res.json(serializedItems)
    }

    async create(req: Request, res: Response) {
        const data = req.body
        return res.json(req.body)
    }
}