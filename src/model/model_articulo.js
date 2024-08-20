const{DataTypes}=require("sequelize")
const database=require("../database")
const proveedor=require("./model_proveedor")

const articulo=database.define("articulo",{
    idarticulo:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    descripcion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    precio:{
        type:DataTypes.DECIMAL(13.2)
    },
    peso:{
        type:DataTypes.DECIMAL(13.2)
    },
    estado:{
        type:DataTypes.STRING
    },
    idproveedor:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    fecha_insert:{
        type:DataTypes.DATE,
    },
    fecha_upd:{
        type:DataTypes.DATE,
    },
    idusuario_upd:{
        type:DataTypes.STRING
    },
    img:{
        type:DataTypes.BLOB("long")
    },
    idproveedor:{
        type:DataTypes.INTEGER,
        foreignKey:true
    },
},{
    tableName:"articulo",
    timestamps:false
})

articulo.hasOne(proveedor,{
    foreignKey:"idproveedor",
    sourceKey:"idproveedor",
    primaryKey:"idproveedor"
})


module.exports=articulo