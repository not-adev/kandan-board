import { Todo } from "../data-models/todomodel.js";
import connect_to_DB from "../bd-connection/connect_to_DB.js";

export default async function ChangeStatus(item){
    await connect_to_DB()
    try {
        const upadate =await Todo.findByIdAndUpdate(item._id,{
            $set :  { status : item.status}
        })
        if(!upadate) 
            return ({status : "failure" })
        return ({status :"succes"})
    } catch (error) {
         return ({status : "failure"  , error: error.message})
    }
}   