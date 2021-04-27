import {Sequelize,Optional,Model,DataTypes} from "sequelize";
import {TaskInstance} from "./task";


export interface UserProps {
    id: number;
    name: string;
}

export interface UserCreationProps extends Optional<UserProps, "id"> {}

export interface UserInstance extends Model<UserProps,UserCreationProps>,UserProps{

    getTask: HasManyGetAssociationMixin<TaskInstance>;
    setTask: HasManySetAssociationMixin<TaskInstance, "id">;
}

export default function(sequelize:Sequelize): ModelCtor<AnimalInstance>{
    return sequelize.define<UserInstance>("user",{
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:DataTypes.STRING
        },

    },{
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
