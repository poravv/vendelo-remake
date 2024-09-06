const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const cliente=require("./model_cliente")
const usuario=require("./model_usuario")
const det_venta=require("./model_detventa")
const comisiones = require("./model_comisiones")
const pago = require("./model_pago")

const vw_venta=sequelize.define("vw_venta",{
    idventa:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    nro_comprobante:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    fecha:{
        type:DataTypes.DATE,
        allowNull:false
    },
    iva_total:{
        type:DataTypes.DECIMAL(13.2),
        allowNull:false
    },
    total:{
        type:DataTypes.DECIMAL(13.2),
        allowNull:false
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:false
    },
    idcliente:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    idusuario:{
        type:DataTypes.STRING,
        allowNull:false
    },
    fecha_upd:{
        type:DataTypes.DATE,
        allowNull:false
    },
    idusuario_upd:{
        type:DataTypes.STRING,
        allowNull:false
    },
    idusuario_insert:{
        type:DataTypes.STRING,
        allowNull:false
    },
    peso_total:{
        type:DataTypes.INTEGER
    },
    factura:{
        type:DataTypes.STRING
    },
    sucursal:{
        type:DataTypes.STRING
    },
    idsucursal:{
        type:DataTypes.INTEGER
    },
    tipo_venta:{
        type:DataTypes.STRING
    },
    costo_envio:{
        type:DataTypes.DECIMAL(13.2),
    },
    retiro:{
        type:DataTypes.STRING,
    },
},{
    tableName:"vw_venta",
    timestamps:false
})

vw_venta.hasOne(cliente,{
    foreignKey:"idcliente",
    sourceKey:"idcliente",
    primaryKey:"idcliente"
})

vw_venta.hasMany(comisiones,{
    foreignKey:"idventa",
    sourceKey:"idventa",
    primaryKey:"idventa"
})


vw_venta.hasOne(usuario,{
    foreignKey:"idusuario",
    sourceKey:"idusuario",
    primaryKey:"idusuario"
})

vw_venta.hasMany(det_venta,{
    foreignKey:"idventa",
    sourceKey:"idventa",
    primaryKey:"idventa"
})

vw_venta.hasMany(pago,{
    foreignKey:"idventa",
    sourceKey:"idventa",
    primaryKey:"idventa"
})


module.exports=vw_venta