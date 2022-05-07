import 'mocha';
import {expect} from 'chai';
import { UserController } from '../controllers/userControllers';
import { UserModel } from '../db/models/user';
import strongPassword from '../validation/passowrd';
describe('User Controllers', ()=>{
    let register = new UserController(UserModel.getInstance()).signup;
    describe('Register a user', ()=>{
        const body={
            username:'user1',
            password:'22222',
            email:'user1@example.com'
        }
        it('Should throw an error if password is not complex', async()=>{
            const result = strongPassword('232');
            expect(result).to.equal(false);
        });
    })
})
