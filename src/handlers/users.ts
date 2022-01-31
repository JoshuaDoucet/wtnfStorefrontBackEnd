// users.ts

// handler for users 

import express, { NextFunction, Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'
import utilities from '../utilities/utilities'

const store = new UserStore();

// /users [GET]
const index = async (_req: Request, res: Response) => {
    try{
        const users = await store.index()
        res.json(users);
    }catch(err){
        res.status(503);
        res.json(`Cannot GET users index. ERR -- ${err}`);
    }
}

// /users/:id [GET] 
const show = async (req: Request, res: Response) => {
    try{
        const user = await store.show(req.params.id);
        if(user){
            res.json(user);
        }else{
            res.status(404);
            res.json(`Cannot GET user with id ${req.params.id}`)
        }
    }catch(err){
        res.status(503)
        res.json(`Cannot GET user with id ${req.params.id} ERR -- ${err}`)
    }
}

// /users [POST]
const create = async (req: Request, res: Response) => {
    var userName: string | undefined;
    try {
        // Pull value for error handling
        userName = req.body.name;
        const user: User = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password_hash: req.body.password_hash,
            phone: req.body.phone,
            email: req.body.email,
            location_id: req.body.location_id,
        };
        const newUser = await store.create(user);
        // Sign new JWT after successful user creation
        var token = jwt.sign({ user: newUser },
             (process.env.JWT_SECRET as string),
             { expiresIn: '1h' });
        res.json(token);
    } catch(error) {
        res.status(400);
        res.json(`User name [${userName}] not added. ERR -- ${error}`);
    }
}

// /users/:id [DELETE]
const destroy = async (req: Request, res: Response) => {
    try{
        const delUser = await store.delete(req.params.id);
        if(delUser){
            res.json(delUser);
        }else{
            res.status(404);
            res.json(`Cannot DELETE user with id ${req.params.id}`)
        }        
    }catch(err) {
        res.status(400);
        res.json(`User id [${req.params.id}] not deleted. ERR -- ${err}`);
    }
}

// /users/authenticate
const authenticate = async (req: Request, res: Response) => {
    try {
        const authUser = await store.authenticate(req.body.email, req.body.password)
        var token = jwt.sign({ user: authUser }, 
            (process.env.JWT_SECRET as string),
            { expiresIn: '1h' });
        res.json(token)
    } catch(error) {
        res.status(401)
        res.json(error)
    }
  }


// Routes to connect the Express application to users data
const userRoutes = (app: express.Application) => {
  app.get('/users', utilities.verifyAuthJWT, index);
  app.get('/users/:id', utilities.verifyAuthJWT, show);
  app.get('/authenticate', authenticate);
  app.post('/users', create);
  app.delete('/users/:id', utilities.verifyAuthJWT, destroy);
}

export default userRoutes;