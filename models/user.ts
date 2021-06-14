import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin
} from "sequelize";
import {TaskInstance} from "./task";


export interface UserProps {
    id: string;
    firstName: string;
    lastName: string;
    pseudo:string;
    password:string;
}

export interface UserCreationProps extends Optional<UserProps, "id"> {}

export interface UserInstance extends Model<UserProps,UserCreationProps>,UserProps{
    getTask: HasManyGetAssociationsMixin<TaskInstance>;
    setTask: HasManySetAssociationsMixin<TaskInstance, "id">;
}

export default function(sequelize:Sequelize): ModelCtor<UserInstance>{
    return sequelize.define<UserInstance>("user",{
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        firstName:{
            type:DataTypes.STRING
        },lastName:{
            type:DataTypes.STRING
        },
        pseudo:{
            type:DataTypes.STRING
        },
        password:{
            type:DataTypes.STRING
        }

    },{
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
