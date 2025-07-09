import { Users } from "../data-models/User.js";
import connect_to_DB from "../bd-connection/connect_to_DB.js";
export default async function GetUsers() {
    await connect_to_DB()
    try {
       
        const users = await Users.find().select('name'); 
    
        return {users: users }
    } catch (error) {
        return{ success: false, message: error.message };
    }

}