import mongoose from "mongoose";

export default async function connect_to_DB() {
   
          console.log('running db_config ')
          const state =  mongoose.connection.readyState;
          if (state!= 1 ){
          await mongoose.connect(`${process.env.DB_CONECTION}`,{
            dbName : 'Todo-assignment'
          })
          let connection = mongoose.connection;
          connection.on('connected',()=>{console.log('connected succesfuly ')})
          connection.on('error',(error)=>{console.log(error)})
          console.log('db connected ')

          }
          else {
            console.log('already connected')
          }
  

}