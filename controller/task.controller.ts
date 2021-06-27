import {ModelCtor} from "sequelize";
import {TaskCreationProps, TaskInstance} from "../models/task";
import {SequelizeManager} from "../models";
import {UserController} from "./user.controller";

export class TaskController{
    Task:ModelCtor<TaskInstance>;

    private static instance: TaskController;

    public static async getInstance(): Promise<TaskController>{
        if(TaskController.instance === undefined) {
            const {Task} = await SequelizeManager.getInstance();
            TaskController.instance = new TaskController(Task);
        }
        return TaskController.instance;
    }

    private constructor(Task: ModelCtor<TaskInstance>){
        this.Task = Task;
    }

    public async getAll(limit?:number,offset?:number):Promise<TaskInstance[] | null>{
        return await this.Task.findAll({
            limit,
            offset
        });
    }

    public async getById(id:string):Promise<TaskInstance|null>{
        return await this.Task.findOne({
            where: {
                id
            }});
    }

    public async getByStatus(status:string):Promise<TaskInstance[] | null>{
        return await this.Task.findAll({
            where: {
                status
            }
        });
    }

    public async getTaskByIdUser(idUser: string) : Promise<TaskInstance[] | null>{
        if(idUser === undefined) return null;

        return await this.Task.findAll({
            where: {
                user_id:idUser
            }
        });
    }
// a finir pour quand on suppr un user
    public async getTasksByIdUser(idUser: string) : Promise<TaskInstance | null>{
        if(idUser === undefined) return null;

        return await this.Task.findOne({
            where: {
                user_id:idUser
            }
        });
    }

    public async removeById(id:string):Promise<Boolean>{
        const taskToDelete = await this.getById(id);
        if(!taskToDelete) return false;

        try {
            await this.Task.destroy({
                where:{
                    id
                }
            });
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }

    public async add(props: TaskCreationProps): Promise<TaskInstance | null>{
        return await this.Task.create({
            ...props
        });
    }

    public async update(id:string,name:string,description:string,difficulty:number):Promise<TaskInstance | null>{
        const task = await this.getById(id);
        if(!task || task.status === "finished")return null;

        else {
            return await task.update({
                name,
                description,
                difficulty
            }, {
                where: {
                    id
                }
            });
        }
    }

    public async addUserToTask(idTask:string, idUser:string):Promise<TaskInstance | null>{
        const userController = await UserController.getInstance();

        const task = await this.getById(idTask);
        const user = await userController.getById(idUser);
        if(!task || !user || task.status == "finished") return null;

        else {
            return await task.update({
                user_id:idUser
            }, {
                where: {
                    id:idTask
                }
            });
        }
    }

    public async startTask(id:string):Promise<TaskInstance | null>{
        const task = await this.getById(id);
        if (!task) return null;
        const previous_task = await this.getById(String(task.id_previous_task));

        if(task.status !== "toDo") return null;

        if (previous_task){
            if(previous_task.status !== "finished"){
                return null;
            }
        }

        return await task.update({
            status:"progress"
        }, {
            where: {
                id
            }
        });
    }

    public async finishTask(id:string):Promise<TaskInstance | null>{
        const task = await this.getById(id);
        if(!task ||  task.status !== "progress") return null;

        else {
            return await task.update({
                status:"finished"
            }, {
                where: {
                    id
                }
            });
        }
    }

    public async giveUpTask(id:string):Promise<TaskInstance | null>{
        const task = await this.getById(id);
        if(!task ||  task.status !== "progress") return null;

        else {
            return await task.update({
                status:"toDo",
                user_id: null
            }, {
                where: {
                    id
                }
            });
        }
    }

    public async addPreviousTask (idTask: string, id_previous_task: string): Promise<TaskInstance | null> {
        if (!idTask || !id_previous_task) {
            return null;
        }
        const current_task = await this.getById(idTask);
        const previous_task = await this.getById(id_previous_task);

        if (!current_task || !previous_task) {
            return null;
        }

        return current_task.update({
           id_previous_task: id_previous_task
        }, {
            where: {
                id: idTask
            }
        });
    }






}
