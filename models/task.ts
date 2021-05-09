import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    HasManyGetAssociationsMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    HasManySetAssociationsMixin
} from "sequelize";

export interface TaskProps {
    id: number;
    name: string;
    description: string;
    difficulty: number;
    status: string;
    user_id: number | null;

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
        },
        difficulty: {
            type: DataTypes.BIGINT
        },
        status: {
            type: DataTypes.STRING
        },
        user_id:{
            type:DataTypes.BIGINT
        }
    },{
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
