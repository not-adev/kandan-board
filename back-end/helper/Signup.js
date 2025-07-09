import bcrypt from 'bcryptjs';
import { Users } from '../data-models/User.js';
import connect_to_DB from "../bd-connection/connect_to_DB.js";
export async function signup({ name, email, password }){
 
 
    await connect_to_DB()
    try {
     
        const existing_user = await Users.findOne({ email })
        if (existing_user) {
            return ({ error: 'user alredy exists ', code: 1, status: 400 })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPasword = await bcrypt.hash(password, salt);
        const newuser = new Users({
            name: name,
            email: email,
            password: hashedPasword,
        })

        await newuser.save();
        return { status: 'success ', code: 2 }
    } catch (error) {
        return (
            {
                error: 'catch error',
                status: 500,
                statusText: 'api didt work ',
                code : 0
            }


        )
    }
}



