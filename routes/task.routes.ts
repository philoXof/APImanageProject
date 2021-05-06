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
        /* parametre non défini */
        res.status(400).end();
        return;
    }
    const taskController = await TaskController.getInstance();
    const task = await taskController.getById(id);
    if(task!==null){
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
/** A FINIR */
    const taskController = await TaskController.getInstance();
    const task = await taskController.getByStatus(status);
    if(task!==null){
        res.json(task);
        res.status(201).end();
    }else {
        res.status(409).end();
    }
});



/**
 * get all task with limit && / || offset
 */
taskRoutes.get("/",async function(req, res)
{
    const taskController = await TaskController.getInstance();
    const taskList = await taskController.getAll();

    if(taskList!==null){
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
    if(name === undefined || description === undefined ){
        res.status(400).end();
        return;
    }
    const taskController = await TaskController.getInstance();
    const task = await taskController.add({
        name,
        description,
        status:"à faire",
        user_id:null
    });
    if(task!==null){
        res.status(201);
        res.json(task);
    }else {
        /* creation non réussie */
        res.status(500).end();
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
        /* task non trouvée */
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
            /* update non réussi */
            res.status(500).end();
        } else {
            res.json(updateTask);
            res.status(200).end();
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
        /* champ(s) non renseigné(s) */
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.getById(user_id);
    if (user===null) {
        /* user non existant */
        res.status(404).end();
    }
    else
    {
        const taskController = await TaskController.getInstance();
        const task = await taskController.getById(id.toString());

        if (task === null) {
            /* task non existante */
            res.status(404).end();
        }
        else
        {
            if(task.status !== "fini" )
            {
                const updateTask = await taskController.update({
                    id: id,
                    name: task.name,
                    description: task.description,
                    status: "en cours",
                    user_id: parseInt(user.id)
                });
                if (updateTask === null) {
                    res.status(500).end();
                } else {
                    res.json(updateTask);
                }
            }
            else
            {
                //utilisateur ne peux pas prendre une tache finis
                res.status(403).end();
            }
        }
    }
});


/**
 * user finish task
 */
taskRoutes.put("/finishTask:id",async function(req, res){
    const id = parseInt(req.params.id);

    if(id === undefined)
    {
        res.status(400).end();
        return;
    }

        const taskController = await TaskController.getInstance();
        const task = await taskController.getById(id.toString());

        if(task===null)
        {
            res.status(404).end();
        }
        else {
            if (task.user_id===null || task.status==="finis")
            {
                res.status(403).end();
            }
            else
            {
                const updateTask = await taskController.update({
                    id: id,
                    name: task.name,
                    description: task.description,
                    status: "finis",
                    user_id: task.id
                });
                if (updateTask === null)
                {
                    /* update non réussie */
                    res.status(500).end();
                }
                else
                {
                    res.json(updateTask);
                    res.status(200).end();
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
    const task = await taskController.getById(id);
    if (task === null)
    {
        /* task non existante */
        res.status(404).end();
    }
    else
    {
        const taskRemove = await taskController.removeById(id);

        if(taskRemove)
        {
            res.status(204).end();
        }
        else
        {
            res.status(500).end();
        }
    }

});

export {
    taskRoutes
};
