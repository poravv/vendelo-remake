const database=require("./database")

const connect = async()=>{
    try{
        await database.authenticate()
        console.log("*** CONECTADO A LA BASE DE DATOS ***")
    }catch(error){
        console.log("Error: ",error)
    }
}

module.exports = {connect}