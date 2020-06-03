import { Request, Response } from 'express'
import knex from '../database/connection'

export default class PointsController {
    async index(req: Request, res: Response) {
        const { uf, city, items } = req.query

        const parsedItems = String(items).split(',').map(item => Number(item.trim()))

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            // .whereIn('points_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        return res.json(points)

    }
    async show(req: Request, res: Response) {
        const { id } = req.params
        // Sem first vem array
        const point = await knex('points').where('id', id).first()

        if (!point) return res.status(404).json({ message: "Ponto não encontrado" })

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            // .select('items.title')
            .select('*')

        return res.json({ point, items })

    }
    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude,
            items
        } = req.body

        const trx = await knex.transaction()

        const point = {
            image: 'https://images.unsplash.com/photo-1481761289552-381112059e05?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80',
            name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude
        }

        const insertedIds = await trx('points').insert(point)

        // acabou de ser criado
        // o último (único)
        const point_id = insertedIds[0]

        // a serem inseridos
        const pointsItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        })

        await trx('points_items').insert(pointsItems)
        await trx.commit()

        return res.json({ id: point_id, ...point })
    }
}