import connect_to_DB from "../bd-connection/connect_to_DB.js";
import { Todo } from "../data-models/todomodel.js";
import { Users } from "../data-models/User.js";
export default async function AddTdod(item) {
    await connect_to_DB()
    try {
        const newTodo = new Todo({
            Todo_title: item.Todo_title,
            Todo_discrition: item.Todo_discrition,
            status: item.status,
            assign_to: item.Assign_to

        })
        await newTodo.save()
        const res = await Users.findOneAndUpdate(
            { name:newTodo.assign_to},
            { $push: { tasks: newTodo._id } },
            { new: true, useFindAndModify: false }
        );
       
    


        return { success: "200", _id: newTodo._id }
    } catch (error) {
        return { error: "500", error: error.message }
    }

}