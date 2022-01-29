// orders.ts

// handler for orders

import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'

const store = new OrderStore();

// /orders [GET]
const index = async (_req: Request, res: Response) => {
    try{
        const orders = await store.index()
        res.json(orders);
    }catch(err){
        res.status(503);
        res.json(`Cannot GET orders index. ERR -- ${err}`);
    }
}

// /orders/:id [GET] 
const show = async (req: Request, res: Response) => {
    try{
        const order = await store.show(req.params.id);
        if(order){
            res.json(order);
        }else{
            res.status(404);
            res.json(`Cannot GET order with id ${req.params.id}`)
        }
    }catch(err){
        res.status(503)
        res.json(`Cannot GET order with id ${req.params.id} ERR -- ${err}`)
    }
}

// /orders [POST]
const create = async (req: Request, res: Response) => {
    var orderName: string | undefined;
    try {
        // Pull name value for error handling
        orderName = req.body.name;
        const order: Order = {
            status: req.body.status,
            user_id: req.body.user_id
        };
        // create product
        const newOrder = await store.create(order);
        res.json(newOrder);
    } catch(error) {
        res.status(400);
        res.json(`Order for user ID ${req.body.user_id} not added. ERR -- ${error}`);
    }
}

// /orders/:id/products GET
const getProducts = async (_req: Request, res: Response) => {
    const orderId: string = _req.params.id
    try {
        const products = await store.getProducts(orderId)
        res.json(products)
    } catch(err) {
        res.status(400);
        res.json("Cannot get products for order. ERR -- " + err);
    }
} 

// /orders/:id/products POST
const addProduct = async (_req: Request, res: Response) => {
    const orderId: string = _req.params.id
    const productId: string = _req.body.product_id
    const quantity: number = _req.body.product_quantity
    try {
        const addedProduct = await store.addProduct(productId, orderId, quantity)
        res.json(addedProduct)
    } catch(err) {
        res.status(400);
        res.json("Cannot add product to order. ERR -- " + err);
    }
} 

// /orders/:id [DELETE]
const destroy = async (req: Request, res: Response) => {
    try{
        const delOrder = await store.delete(req.params.id);
        if(delOrder){
            res.json(delOrder);
        }else{
            res.status(404);
            res.json(`Cannot DELETE order with id ${req.params.id}`)
        }        
    }catch(err) {
        res.status(400);
        res.json(`Order id [${req.params.id}] not deleted. ERR -- ${err}`);
    }
}

// Routes to connect the Express application to products data
const orderRoutes = (app: express.Application) => {
  app.get('/orders', index)
  app.get('/orders/:id', show)
  app.get('/orders/:id/products', getProducts)
  app.post('/orders', create)
  app.post('/orders/:id/products', addProduct)
  app.delete('/orders/:id', destroy)
}

export default orderRoutes;