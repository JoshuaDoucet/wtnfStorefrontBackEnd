// colorsSpec.ts

// Tests for testing colors endpoints

import supertest from 'supertest';
import app from'../../server'; // Where app is an Express server object
import {Color, ColorStore} from '../../models/color'

const request = supertest(app); 
const colorStore = new ColorStore();
const redColor: Color = {
    name: "Red",
    red: 255,
    hex: "FF0000"
};

let colorID: string | undefined;
let color: Color;

// remove all colors from table before any test and add 1 color
beforeEach( async function() {
    colorStore.deleteAll();
    color = await colorStore.create(redColor);
    colorID = color.id;
});

describe('Test colors endpoint responses', () => {    
     it('index: GET /colors', async(done) => {   
        const response = await request.get('/colors');
        expect(response.status).toBe(200);         
        done();     
    })

    it(`show: GET /colors/:id`, async(done) => {   
        const response = await request.get(`/colors/${colorID}`);
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(color.name);   
        expect(response.body.red).toEqual(color.red);   
        expect(response.body.hex).toEqual(color.hex);   
        done();     
    })

    it(`create: POST /colors`, async(done) => {   
        const response = await request
            .post(`/colors`)
            .send(redColor);
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(color.name);   
        done();     
    })

    it(`destroy: DELETE /colors/:id`, async(done) => {   
        const response = await request
            .delete(`/colors/${colorID}`)
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(color.name);   
        done();     
    })
});