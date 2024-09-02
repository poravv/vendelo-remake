const express = require('express');
const app = express()
const cors = require('cors');
const configrutas =  require('./config_rutas')
const port = process.env.PORT||3000;

const { keycloak,session } = require('./middleware/keycloak_validate');
const { connect } = require('./conect');

//Configuracion del keycloak
app.use(session);
app.use(keycloak.middleware());

app.use(cors());/*aplica permiso para todos los origenes*/

/*Filtramos los origenes que se pueden conectar*/
//const siteList = ['http://localhost:3000','https://pohapp-web.onrender.com/']
//app.use(cors({origin:siteList}));
/*
app.use(cors(
    {
        origin: "http://localhost:3000", //servidor que deseas que consuma o (*) en caso que sea acceso libre
        credentials: true
    }
    ));
*/

connect();


app.use(express.urlencoded({extended : false}))
app.use(express.json({limit: '50mb',extended: true, parameterLimit:500000}));
app.use(express.json())
app.use(configrutas)

//Rutas --------------------------------
app.get('/',(req,res)=>{
    res.send('Api Rest vendelo')
});

//Server Running ----------------------
app.listen(port,()=>{
    console.log("server corriendo en puerto: ",port);
});
