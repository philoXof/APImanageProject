import express from "express";
import {TaskController} from "../controller/task.controller";

const taskRoutes = express();

/**
 * get task by id
 */
taskRoutes.get("/:id",async function(req, res){
    const id = req.params.id;
    if(id===undefined){
        /* parametre non défini */
        res.status(400).end();
        return;
    }
    const taskController = await TaskController.getInstance();
    const task = await taskController.getById(id);
    if(task){
        res.json(task);
        res.status(201).end();
    }else {
        /* task non existante */
        res.status(404).end();
    }
});


/**
 * get all task by the idUser
 */
taskRoutes.get("/idUser/:idUser",async function(req, res){
    const idUser = req.params.idUser;
    if(idUser === undefined){
        res.status(400).end();
        return;
    }
    const taskController = await TaskController.getInstance();
    const task = await taskController.getTaskByIdUser(idUser);
    if(task!==null){
        res.json(task);
        res.status(201).end();
    }else {
        res.status(409).end();
    }
});

/**
 * obtenir la tache par status
 * */
taskRoutes.get("/status/:status",async function(req, res){
    const status = req.params.status;
    if(status === undefined)
    {
        res.status(400).end();
        return;
    }
    const taskController = await TaskController.getInstance();
    const task = await taskController.getByStatus(status);
    if(task){
        res.json(task);
        res.status(201).end();
    }else {
        res.status(409).end();
    }
});


/**
 * get all task with limit && / || offset
 */
taskRoutes.get("/",async function(req, res){
    const taskController = await TaskController.getInstance();
    const taskList = await taskController.getAll();

    if(taskList){
        res.json(taskList);
        res.status(200).end();
    }else {
        res.status(404).end();
    }
});

/**
 * add task
 * by default no user assigned && status "disponible"
 */
taskRoutes.post("/",async function(req, res) {
    const name = req.body.name;
    const description = req.body.description;
    const difficulty = req.body.difficulty;
    if(name === undefined || description === undefined || difficulty === undefined){
        res.status(400).end();
        return;
    }
    const taskController = await TaskController.getInstance();
    const task = await taskController.add({
        name,
        description,
        status:"toDo",
        difficulty,
        user_id:null
    });
    if(task){
        res.status(201);
        res.json(task);
    }else {
        /* creation non réussie */
        res.status(500).end();
    }
});

/**
 * update task name / description / difficulty
 */
taskRoutes.put("/update/:id",async function(req, res){
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const difficulty = parseInt(req.body.difficulty);

    if(id === undefined || name === undefined && description === undefined && difficulty === undefined){
        res.status(400).end();
        return;
    }

    const taskController = await TaskController.getInstance();
    const updateTask = await taskController.update(id,name,description,difficulty);
    if (!updateTask) {
        /* update non réussi */
        res.status(500).end();
    } else {
        res.json(updateTask);
        res.status(200).end();
    }

});


/**
 * asign task to user need user's id in body && task id in params
 */
taskRoutes.put("/:idTask/user/:idUser",async function(req, res){
    const idTask = req.params.idTask;
    const idUser = req.params.idUser;

    if(idTask === undefined || idUser === undefined ) {
        res.status(400).end();
        return;
    }
    const taskController = await TaskController.getInstance();

    const updateTask = await taskController.addUserToTask(idTask,idUser);
    if (!updateTask) {
        res.status(500).end();
    } else {
        res.json(updateTask);
    }

});


/**
 * start task
 */
taskRoutes.put("/startTask/:id",async function(req, res){
    const id = req.params.id;

    if(id === undefined)
    {
        res.status(400).end();
        return;
    }

    const taskController = await TaskController.getInstance();
    const updateTask = await taskController.startTask(id);
    if (!updateTask) {
        /* update non réussie */
        res.status(500).end();
    }
    else {
        res.json(updateTask);
        res.status(200).end();
    }
});

/**
 *giveUp Task
 */

taskRoutes.put("/giveUpTask/:id",async function(req, res){
    const id = req.params.id;

    if(id === undefined)
    {
        res.status(400).end();
        return;
    }

    const taskController = await TaskController.getInstance();
    const updateTask = await taskController.giveUpTask(id);
    if (!updateTask) {
        /* update non réussie */
        res.status(500).end();
    }
    else {
        res.json(updateTask);
        res.status(200).end();
    }
});


/**
 * user finish task
 */
taskRoutes.put("/finishTask/:id",async function(req, res){
    const id = req.params.id;

    if(id === undefined)
    {
        res.status(400).end();
        return;
    }

    const taskController = await TaskController.getInstance();
    const updateTask = await taskController.finishTask(id);
    if (!updateTask) {
        /* update non réussie */
        res.status(500).end();
    }
    else {
        res.json(updateTask);
        res.status(200).end();
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

    if (taskRemove) {
        res.status(204).end();
    } else {
        res.status(500).end();
    }
});

export {
    taskRoutes
};
