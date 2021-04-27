import express from "express";
import {TaskController} from "../controller/task.controller";

const taskRoutes = express();

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

taskRoutes.get("/",async function(req, res){
    const limit = parseInt(req.query.limit as string) || 10;
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

taskRoutes.post("/",async function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    if(firstName === undefined || lastName  ){
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.add({
        firstName: firstName,
        lastName
    });
    if(user!==null){
        res.status(201);
        res.json(user);
    }else {
        res.status(409).end();
    }
});

taskRoutes.put("/:id",async function(req, res){
    const id = req.params.id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if(id === null || lastName === null || firstName === null)
    {
        res.status(400).end();
        return;
    }

    const userController = await UserController.getInstance();
    const user = await userController.update({
        id,
        firstName,
        lastName
    });
    if(user === null)
    {
        res.status(404).end();
    }
    else
    {
        res.json(user);
    }
});

taskRoutes.delete("/:id", async function(req, res) {
    const id = req.params.id;

    if(id === null)
    {
        res.status(400).end();
    }
    const userController = await UserController.getInstance();
    const userRemove = await userController.removeById(id);

    if(userRemove)
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