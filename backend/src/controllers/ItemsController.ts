import { Request, Response } from 'express'
import knex from '../database/connection'
import host from '../config/host';
export default class ItemsController {

    async index(req: Request, res: Response) {
        const items = await knex('items').select('*')
        const url = host + '/uploads/'
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: url + item.image,
            }
        })
        return res.json(serializedItems)
    }

    async create(req: Request, res: Response) {
        const data = req.body
        return res.json(req.body)
    }
}