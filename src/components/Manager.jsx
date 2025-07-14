import React, { useContext, useRef } from 'react'
import { useState, useEffect } from 'react'
import SingleTodo from './SingleTodo'
import socketContext from '../contexts/socketContext'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
const Manager = () => {
    const socket = useContext(socketContext)
    const [todo, settodo] = useState({ Todo_title: "", Todo_discrition: "", status: "", Assign_to: "", _id: "" })
    const [todos_complete, setTodos_complete] = useState([])
    const [todos, setTodos] = useState([])
    const [todos_InP, setTodos_Inp] = useState([])
    const [alluser, setAlluser] = useState([])
    const [userfromDb, setUserfromDb] = useState([])
    const selectRef = useRef(null)
    const [smartstate, setSmartstate] = useState(false)
    useEffect(() => {
        socket.emit("get_all_users", {}, (users) => {
            setAlluser(users)
            setUserfromDb(users)
        })

        socket.emit("get_all_todos", {}, ({todo,in_porgresss,complet}) => {
            console.log("emit send for todos")
            setTodos(todo)
            setTodos_Inp(in_porgresss)
            setTodos_complete(complet)
            
        })
        socket.on("save_new_todo", (item) => {
            console.log("server response with item", item)
            if (item.status == "Todo") {
                setTodos(prevItems => [...prevItems, item]);
                console.log(todos)
            }
            else if (item.status == "In-progress") {
                setTodos_Inp(prevItems => [...prevItems, item]);
                console.log(todos_InP)
            }
            else if (item.status == "Completed") {
                setTodos_complete(prevItems => [...prevItems, item]);
                console.log(todos_complete)
            }


        })



        socket.on("delet_your_todo", (item) => {
            console.log("delete command from socket")
            console.log(item)
            if (item.status == "Todo") {
                console.log("hllow")
                let new_arr = todos.filter((e) => {
                    return e._id != item._id;
                })
                setTodos(new_arr)
            }
            else if (item.status == "In-progress") {
                let new_arr = todos_InP.filter((e) => {
                    return e._id != item._id;
                })
                setTodos_Inp(new_arr)
            }
            else if (item.status == "Completed") {
                let new_arr = todos_complete.filter((e) => {
                    return e.id != item._id;
                })
                setTodos_complete(new_arr)
            }
        })

        socket.on("change_your_status", ({ item, index, source, dest }) => {
            const sourceList = getListById(source);
            const destList = getListById(dest);
            const setSource = getSetterById(source)
            const setdest = getSetterById(dest)
            const newSource = [...sourceList];
            newSource.splice(index, 1);
            const newDest = [...destList];
            newDest.splice(index, 0, item);
            setSource(newSource);
            setdest(newDest);



        })
        return () => {

        }
    }, [])

   

    const hanldesave = async (e) => {
     
        setSmartstate(false)
        setAlluser(userfromDb)
        await socket.emit("save_todo", todo, (_id) => {
            const updated = { ...todo, _id };
            settodo(() => updated);

         
            if (updated.status === "Todo") {
                setTodos(prevItems => [...prevItems, updated]);
            } else if (updated.status === "In-progress") {
                setTodos_Inp(prevItems => [...prevItems, updated]);
            } else if (updated.status === "Completed") {
                setTodos_complete(prevItems => [...prevItems, updated]);
            }

            console.log("emit send to server", updated);

         
            settodo({
                Todo_title: "",
                Todo_discrition: "",
                status: "",
                Assign_to: "",
                _id: ""
            });
        });
    };





    function handlDelete(e, item) {
        let a = confirm('Are You sure You want to delete the Todo')
        if (a) {
            socket.emit("delete_todo", item)
            if (item.status == "Todo") {
                let new_arr = todos.filter((e) => {
                    return e._id != item._id;
                })
                setTodos(new_arr)
            }
            else if (item.status == "In-progress") {
                let new_arr = todos_InP.filter((e) => {
                    return e._id != item._id;
                })
                setTodos_Inp(new_arr)
            }
            else if (item.status == "Completed") {
                let new_arr = todos_complete.filter((e) => {
                    return e._id != item._id;
                })
                setTodos_complete(new_arr)
            }




        }

    }

    function handleEdit(e, item) {
        let a = confirm('Are You sure You want to edit todo')
        if (a) {
            if (item.status == "Todo") {
                let new_arr = todos.filter((e) => {
                    return e._id != item._id;
                })
                setTodos(new_arr)
            }
            else if (item.status == "In-progress") {
                let new_arr = todos_InP.filter((e) => {
                    return e._id != item._id;
                })
                setTodos_Inp(new_arr)
            }
            else if (item.status == "Completed") {
                let new_arr = todos_complete.filter((e) => {
                    return e.id != item._id;
                })
                setTodos_complete(new_arr)
            }

            settodo(item)
            socket.emit("delete_todo", item)

        }



    }

    function handlechange(e) {
        let name = e.target.name;
        let value = e.target.value
        settodo((values) => ({ ...values, [name]: value }))
        


    }

    function smartSelect() {
        console.log("hi")

        socket.emit("smartSelect", {}, (users) => {
            console.log(users)
            setAlluser(users)
            setSmartstate(true)
        })




    }


    const getListById = (id) => {
        if (id === 'Todo') return todos;
        if (id === 'In-progress') return todos_InP;
        if (id === 'Completed') return todos_complete;
    };

    const getSetterById = (id) => {
        if (id === 'Todo') return setTodos;
        if (id === 'In-progress') return setTodos_Inp;
        if (id === 'Completed') return setTodos_complete;
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
      

        const sourceList = getListById(source.droppableId);

        const destList = getListById(destination.droppableId);
        const setSource = getSetterById(source.droppableId);
        const setDest = getSetterById(destination.droppableId);

        let item = sourceList[source.index];
        item.status = destination.droppableId
        const newSource = [...sourceList];
        newSource.splice(source.index, 1);
        console.log(item)

        const newDest = [...destList];
        newDest.splice(destination.index, 0, item);
        if(source.droppableId === destination.droppableId) return

        setSource(newSource);
        setDest(newDest);
        socket.emit("change_status", { item: item, index: source.index, source: source.droppableId, dest: destination.droppableId, })
        console.log("emit send for drag ")
    };


    return (
        <div className='sm:w-[60%] sm:m-auto  mx-4  flex flex-col justify-center items-center    '>
            <div className='text-2xl mt-8 font-bold m-auto flex'>
                <span > &lt;TO</span>
                <span className='text-green-300'>DO/&gt;</span>
            </div>
            <div className=' font-extralight'>Your Own TODO dashboard </div>
            <div className='w-full flex'>

                <input type="text" onChange={handlechange} value={todo.Todo_title} name="Todo_title" id="Title" placeholder='Title' className='px-3 py-0.5 border-green-700 text-sm border-2 w-full mx-2 rounded-2xl  bg-white ' />
                <div className='border-2 border-green-700 flex rounded-2xl px-3 bg-white'>
                    <select value={todo.status} onChange={handlechange} name='status' id='status' placeholder='status' className='outline-0 w-[200px]' >
                        <option value="status">status</option>
                        <option value="Todo">Todo</option>
                        <option value="In-progress">In-progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                </div>
            </div>
            <input type="text" onChange={handlechange} value={todo.Todo_discrition} name="Todo_discrition" id="Discription" placeholder='Discription' className='px-3 my-2 py-0.5 text-sm border-2  border-green-700 rounded-2xl w-full bg-white ' />
            <div className='flex items-center gap-2'>
                <select ref={selectRef} value={todo.Assign_to} onChange={handlechange} name='Assign_to' id='Assign_to' placeholder='status' className='outline-0 p-1 bg-white border-2 rounded-full border-green-700  w-[200px]' >
                    <option value="Assign to">Assign to</option>
                    {
                        Array.isArray(alluser) && alluser.map((item) => (
                            <option key={item.name} value={item.name}>{item.name}</option>
                        ))
                    }
                </select>
                <button onClick={() => smartSelect()} className='flex justify-center items-center my-5 h-8 border-1 px-3 w-fit  bg-green-300  hover:bg-green-600 rounded-2xl'>
                    <span>{smartstate ? "now slect have been updated" : "smart select"}</span>
                </button>
            </div>
            <button onClick={hanldesave} className='flex justify-center items-center my-5 h-8 border-1 px-3 w-fit  bg-green-300  hover:bg-green-600 rounded-2xl'>
                <span>Save</span>
            </button>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='main_container flex gap-x-2 justify-around items-start w-[90vw] '>
                    <Droppable droppableId="Todo">
                        {(provided) => (
                            <div className='bg-gradient-to-br  from-red-700 to-red-400 py-2 px-2 w-full' ref={provided.innerRef} {...provided.droppableProps}>
                                <span className='font-bold text-white text-center text-2xl'>Todo</span>
                                {  Array.isArray(todos) && todos.map((item, index) => (
                                    <Draggable key={item._id} draggableId={item._id} index={index}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <SingleTodo
                                                    title={item.Todo_title}
                                                    discription={item.Todo_discrition}
                                                    status={item.status}
                                                    assin_to={item.Assign_to}
                                                    handlDelete={(e) => handlDelete(e, item)}
                                                    handleEdit={(e) => handleEdit(e, item)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="In-progress">
                        {(provided) => (
                            <div className='w-full py-2 px-2 bg-gradient-to-br from-blue-700 to-blue-300' ref={provided.innerRef} {...provided.droppableProps}>
                                <span className='font-bold text-white text-center text-2xl'>In Progress</span>
                                {  Array.isArray(todos_InP) &&  todos_InP.map((item, index) => (
                                    <Draggable key={item._id} draggableId={item._id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <SingleTodo
                                                    title={item.Todo_title}
                                                    discription={item.Todo_discrition}
                                                    status={item.status}
                                                    assin_to={item.Assign_to}
                                                    handlDelete={(e) => handlDelete(e, item)}
                                                    handleEdit={(e) => handleEdit(e, item)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="Completed">
                        {(provided) => (
                            <div className='w-full py-2 px-2 bg-gradient-to-br from-green-700 to-green-300' ref={provided.innerRef} {...provided.droppableProps}>
                                <span className='font-bold text-white text-center text-2xl'>Completed</span>
                                { Array.isArray(todos_complete) &&  todos_complete.map((item, index) => (
                                    <Draggable key={item._id} draggableId={item._id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <SingleTodo
                                                    title={item.Todo_title}
                                                    discription={item.Todo_discrition}
                                                    status={item.status}
                                                    assin_to={item.Assign_to}
                                                    handlDelete={(e) => handlDelete(e, item)}
                                                    handleEdit={(e) => handleEdit(e, item)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>




                </div>





            </DragDropContext >
        </div >
    )
}

export default Manager