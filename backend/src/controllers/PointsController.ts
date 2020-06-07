import { Request, Response } from 'express'
import knex from '../database/connection'

export default class PointsController {
    async index(req: Request, res: Response) {
        const { uf, city, items } = req.query

        const parsedItems = String(items).split(',').map(item => Number(item.trim()))

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        // Serializações // API Transform
        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.102:3334/uploads/${point.image}`
            }
        })
        return res.json(serializedPoints)
    }

    async show(req: Request, res: Response) {
        const { id } = req.params
        // Sem first vem array
        const point = await knex('points').where('id', id).first()

        if (!point) return res.status(404).json({ message: "Ponto não encontrado" })
        // Serrialziação // API Transform
        const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.102:3334/uploads/${point.image}`
        }

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('items.title')

        return res.json({ point: serializedPoint, items })

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
            image: req.file.filename,
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
        const pointsItems = items
            .split(',')
            // +=>converte para num (i.e. => +item.trim())
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
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