import { Todo } from "../data-models/todomodel.js";
import connect_to_DB from "../bd-connection/connect_to_DB.js";

export default async function get_all_todos() {
    await connect_to_DB()
    try {

        const todos =await Todo.find()
        return todos
    } catch (error) {
      return { status: "failure", error: error.message };
    }
}