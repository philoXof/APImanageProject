import {ModelCtor} from "sequelize";
import {TaskCreationProps, TaskInstance} from "../models/task";
import {SequelizeManager} from "../models";

export class TaskController{
    Task:ModelCtor<TaskInstance>;

    private static instance: TaskController;

    public static async getInstance(): Promise<TaskController> {
        if(TaskController.instance === undefined) {
            const {Task} = await SequelizeManager.getInstance();
            TaskController.instance = new TaskController(Task);
        }
        return TaskController.instance;
    }

    private constructor(Task: ModelCtor<TaskInstance>) {
        this.Task = Task;
    }

    public async getAll(limit:number,offset:number):Promise<TaskInstance[] | null>{
        return await this.Task.findAll({
            // limit,
            // offset
        });
    }

    public async getById(id:string):Promise<TaskInstance|null>{
        return await this.Task.findOne({where: {
                id
            }});
    }

    public async removeById(id:string):Promise<Boolean>{
        const taskToDelete = await this.getById(id);
        if(taskToDelete === null)
        {
            return false;
        }
        else
        {
            try
            {
                await this.Task.destroy({
                    where:{
                        id: taskToDelete.id
                    }
                });
                return true;
            }
            catch (err)
            {
                console.error(err);
                return false;
            }
        }
    }

    public async add(props: TaskCreationProps): Promise<TaskInstance | null> {
        return await this.Task.create({
            ...props
        });
    }

    public async update(options: TaskCreationProps):Promise<TaskInstance | null>{
        const taskUpdate = await this.getById(options.id.toString());

        if(taskUpdate === null)
        {
            return null;
        }
        else
        {
            return await taskUpdate.update({

                name: options.name
            }, {
                where: {
                    id: options.id
                }
            });
        }
    }

}