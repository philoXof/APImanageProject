import express from "express";
import {TaskController} from "../controller/task.controller";
import { UserController } from "../controller/user.controller";

const taskRoutes = express();

/**
 * get task by id
 */
taskRoutes.get("/:id",async function(req, res){
    const id = req.params.id;
    if(id===undefined){
        res.status(400).end();
        return;
    }
    const taskController = await TaskController.getInstance();
    const task = await taskController.getById(id);
    if(task!==null){
        res.json(task);
        res.status(201).end();
    }else {
        res.status(409).end();
    }
});


//todo get by id user
//todo get by status

/**
 * get all task with limit && / || offset
 */
//todo virer offset limit
taskRoutes.get("/",async function(req, res){
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const taskController = await TaskController.getInstance();
    const taskList = await taskController.getAll(limit,offset);

    if(taskList!==null){
        res.json(taskList);
        res.status(201).end();
    }else {
        res.status(409).end();
    }
});

/**
 * add task
 * by default no user assigned && status "disponible"
 */
taskRoutes.post("/",async function(req, res) {
    const name = req.body.name;
    const description = req.body.description;
    if(name === undefined || description === undefined ){
        res.status(400).end();
        return;
    }
    const taskController = await TaskController.getInstance();
    const task = await taskController.add({
        name,
        description,
        status:"taches",
        user_id:null
    });
    if(task!==null){
        res.status(201);
        res.json(task);
    }else {
        res.status(409).end();
    }
});

/**
 * update task name / description
 */
taskRoutes.put("/name_desc:id",async function(req, res){
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;

    if(id === undefined || name === undefined || description === undefined)
    {
        res.status(400).end();
        return;
    }
    const taskController = await TaskController.getInstance();
    const task = await taskController.getById(id);
    if(task===null){
        res.status(404).end();
    }else {
        const updateTask = await taskController.update({
            id: parseInt(id),
            name,
            description,
            status: task.status,
            user_id: null
        });
        if (updateTask === null) {
            res.status(404).end();
        } else {
            res.json(updateTask);
        }
    }
});

/**
 * asign task to user need user's id in body && task id in params
 */
taskRoutes.put("/userTask:id",async function(req, res){
    const id = parseInt(req.params.id);
    const user_id = req.body.user_id;
    //TODO: prendre en compte si la tache est déja finis ou pas
    if(id === undefined || user_id === undefined )
    {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.getById(user_id);
    if (user===null) {
        res.status(404).end();
    }else {
        const taskController = await TaskController.getInstance();
        const task = await taskController.getById(id.toString());
        if (task === null) {
            res.status(404).end();
        } else {
            const updateTask = await taskController.update({
                id: id,
                name: task.name,
                description: task.description,
                status: "en cours",
                user_id: parseInt(user.id)
            });
            if (updateTask === null) {
                res.status(404).end();
            } else {
                res.json(updateTask);
            }
        }
    }
});



/**
 * user finish task
 */
//todo: ne peux pas finir une tache si pas d'utilisateur
taskRoutes.put("/userTask:id",async function(req, res){
    const id = parseInt(req.params.id);
    const user_id = req.body.user_id;

    if(id === undefined || user_id === undefined )
    {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.getById(user_id);
    if (user===null) {
        res.status(404).end();
    }else{
        const taskController = await TaskController.getInstance();
        const task = await taskController.getById(id.toString());
        if(task===null){
            res.status(404).end();
        }else {
            const updateTask = await taskController.update({
                id: id,
                name: task.name,
                description: task.description,
                status: "en cours",
                user_id: parseInt(user.id)
            });
            if (updateTask === null) {
                res.status(404).end();
            } else {
                res.json(updateTask);
            }
        }
    }
});

/**
 * delete task by id
 */
taskRoutes.delete("/:id", async function(req, res) {
    const id = req.params.id;

    if(id === null)
    {
        res.status(400).end();
    }
    const taskController = await TaskController.getInstance();
    const taskRemove = await taskController.removeById(id);
    if(taskRemove)
    {
        res.status(204).end();
    }
    else
    {
        res.status(404).end();
    }
});

export {
    taskRoutes
};