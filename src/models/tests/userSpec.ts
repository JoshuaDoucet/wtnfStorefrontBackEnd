// userSpec.ts

// Tests for User model

import {LocationStore, Location} from '../location'
import {UserStore, User} from '../user'
import utilities from '../../utilities/utilities'
import bcrypt from 'bcrypt'

describe('User model tests', () => {
    const userStore = new UserStore();
    var testUser: User = {
        first_name: "Everly",
        last_name: "Penelo",
        password_hash: "sampleHash4432423dccc",
        phone: 5552221678,
        email: "iceandfire@google.com",
        location_id: "1"
    }
    var userId : string | undefined;

    const locationStore = new LocationStore();
    var testLocation: Location = {
        name: "Test Location",
        zip: 80922
    }
    var locationId : string | undefined;
    
    beforeAll(async function () {
        await locationStore.deleteAll();
        const location = await locationStore.create(testLocation);
        locationId = location.id;
        testUser.location_id = locationId;
    });

    afterAll(async function(){
        locationStore.deleteAll();
        userStore.deleteAll();
    });

    beforeEach( async function() {
        await userStore.deleteAll();
        const user = await userStore.create(testUser);
        userId = user.id;
    });

    // READ tests
    it('Should have an index method', () => {
        expect(userStore.index).toBeDefined();
    });
    it('index should return a list of 1 user', async () => {
        const result = await userStore.index();
        expect(result.length).toEqual(1);
    });
    it('Should have a show method', () => {
        expect(userStore.show).toBeDefined();
    });

    // CREATE tests
    it('Should have a create method', () => {
        expect(userStore.create).toBeDefined();
    });
    it('Should add sample user to the users table', async () => {
        await userStore.deleteAll();
        const createResult = await userStore.create(testUser);
        // create a copy of result to change null values to undefined 
        const copyResult = (utilities.objectNullValsToUndefined(createResult) as User);

        // check to see if correct location details were added to new row
        expect(copyResult.first_name).toEqual(testUser.first_name);
        expect(copyResult.last_name).toEqual(testUser.last_name);
        // Input password should not equal pass in DB
        expect(copyResult.password_hash).not.toEqual(testUser.password_hash);
        // Test password hashing
        const authUser = userStore.authenticate(testUser.email, testUser.password_hash);
        expect(typeof authUser).toEqual(typeof copyResult)
        expect(copyResult.phone+'').toEqual(testUser.phone+'');
        expect(copyResult.email).toEqual(testUser.email);
        // TODO test location ID
    });

    // DELETE tests
    it('Should have a delete method', () => {
        expect(userStore.delete).toBeDefined();
    });
    it("delete should remove a user from the users table", async () => {
        // create location row
        await userStore.deleteAll();
        const createResult = await userStore.create(testUser);
        const userId = createResult.id?.toString();
        // check id is defined for added location
        if(userId){
            // delete user row
            const delResult = await userStore.delete(userId.toString());
            // check to see if correct row was deleted
            expect(delResult.id).toEqual(createResult.id);
            expect(delResult.first_name).toEqual(createResult.first_name);
        }else{
            throw new Error("Invalid user id");
        }
    });

});