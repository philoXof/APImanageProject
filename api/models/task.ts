import {Sequelize,Optional,Model,DataTypes} from "sequelize";


export interface TaskProps {
    id: number;
    name: string;
    description: string;
}

export interface TaskCreationProps extends Optional<TaskProps, "id"> {}

export interface TaskInstance extends Model<TaskProps,TaskCreationProps>,TaskProps{

    getUser: HasOneGetAssociationMixin<TaskInstance>;
    setUser: HasOneSetAssociationMixin<TaskInstance, "id">;
}

export default function(sequelize:Sequelize): ModelCtor<TaskInstance>{
    return sequelize.define<TaskInstance>("task",{
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    },{
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
