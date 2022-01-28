import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

//Route functions
import colorRoutes from './handlers/colors'
import locationRoutes from './handlers/locations'
import materialRoutes from './handlers/materials'
import productRoutes from './handlers/products'

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hi! Welcome to the WTNF Storefront!')
})

// Connect color routes to Express application
colorRoutes(app);
locationRoutes(app);
materialRoutes(app);
productRoutes(app);

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})

export default app;