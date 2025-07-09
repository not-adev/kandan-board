import connect_to_DB from "../bd-connection/connect_to_DB.js";
import { Todo } from "../data-models/todomodel.js";
import { Users } from "../data-models/User.js";

export default async function deleteTodo(item) {
    await connect_to_DB()
    try {
        const deletedTask = await Users.findOneAndUpdate({ name: item.Assign_to },
            { $pull: { tasks: { _id: item._id } } }
        )
        // const name = await Users.find({name : item.Assign_to})
        // console.log(name)
        console.log(item.Assign_to)
        const deleted = await Todo.deleteOne({ _id: item._id })
        if (!deleted && !deletedTask) {
            return ({ message: "todo doesnot exist", status: 500 })
        }
        return ({ message: "todo deleted", status: 200 })
    } catch (error) {
        return ({ message: "some error occured", error: error.message, status: 500 })
    }
}