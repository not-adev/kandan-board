import mongoose from "mongoose";

let TodoSchema = new mongoose.Schema({
    Todo_title: {
        type: String,
      
    },
    Todo_discrition: {
        type: String,
     
    },
    status: {
        type: String,
        default: "todo"
    },
    assign_to : {
    type: String,
  
}
   
})

export const Todo = mongoose.models.todo || mongoose.model('todo', TodoSchema);
