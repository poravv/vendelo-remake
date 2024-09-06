const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const cliente=require("./model_cliente")
const usuario=require("./model_usuario")
const det_venta=require("./model_detventa")
const comisiones = require("./model_comisiones")
const pago = require("./model_pago")

const venta=sequelize.define("venta",{
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
    idsucursal:{
        type:DataTypes.INTEGER
    },
    tipo_venta:{
        type:DataTypes.STRING,
    },
    cuotas:{
        type:DataTypes.INTEGER,
    },
    retiro:{
        type:DataTypes.STRING,
    },
},{
    tableName:"Venta",
    timestamps:false
})

venta.hasOne(cliente,{
    foreignKey:"idcliente",
    sourceKey:"idcliente",
    primaryKey:"idcliente"
})

venta.hasMany(comisiones,{
    foreignKey:"idventa",
    sourceKey:"idventa",
    primaryKey:"idventa"
})

venta.hasMany(pago,{
    foreignKey:"idventa",
    sourceKey:"idventa",
    primaryKey:"idventa"
})

venta.hasOne(usuario,{
    foreignKey:"idusuario",
    sourceKey:"idusuario",
    primaryKey:"idusuario"
})

venta.hasMany(det_venta,{
    foreignKey:"idventa",
    sourceKey:"idventa",
    primaryKey:"idventa"
})


module.exports=venta