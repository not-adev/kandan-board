import { Users } from "../data-models/User.js";
import bcrypt from 'bcryptjs';
import connect_to_DB from "../bd-connection/connect_to_DB.js";
import jwt from 'jsonwebtoken';


export async function Login(data) {
await connect_to_DB()
    try {
        
        const { email, password } = data
        const userExist = await Users.findOne({ email })
        if (!userExist) {
            return ({ status: 'user doesnt exists',code : 0 })
        }
        const compare = await bcrypt.compare(password, userExist.password);
        if (!compare) {
            return ({ status: 'incorrect password or against email' ,code : 0})
        }
        const token = await jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRY });
        const response = {
           status: 'success ',
           code : 1,
           token : token
        }
       
        return response;
    } catch (error) {
        return {error : error ,message : 'log in failed '}
        
    }
        
    

}