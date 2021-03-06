import express from "express";
import {UserController} from "../controller/user.controller";
import {TaskController} from "../controller/task.controller";
import task from "../models/task";

const userRoutes = express();


userRoutes.get("/:id",async function(req, res){
    const id = req.params.id;
    if(id===undefined)
    {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.getById(id);

    if(user)
    {
        res.json(user);
        res.status(201).end();
    }
    else
    {
        res.status(404).end();
    }
});



userRoutes.get("/",async function(req, res){
    const userController = await UserController.getInstance();
    const userList = await userController.getAll();
    if(userList!==null)
    {
        res.json(userList);
        res.status(201).end();
    }
    else
    {
        res.status(404).end();
    }
});



userRoutes.post("/",async function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const pseudo = req.body.pseudo
    const password = req.body.password;

    if(firstName === undefined || lastName === undefined || pseudo === undefined || password === undefined)
    {
        res.status(400).end();
        return;
    }

    const userController = await UserController.getInstance();
    const userExist = await userController.getByPseudo(pseudo);
    if (userExist === null){
        const user = await userController.add({
            firstName,
            lastName,
            pseudo,
            password
        });
        if(user){
            res.status(201);
            res.json(user);
        }else {
            res.status(409).end();
        }
    }else{
        res.status(403).end();
        return;
    }

});


userRoutes.put("/:id",async function(req, res){
    const id = req.params.id;

    if(id === undefined )
    {
        res.status(400).end();
        return;
    }

    const userController = await UserController.getInstance();
    const user = await userController.getById(id);
    if (user === null)
    {
        res.status(404).end();
        return;
    }else{
        /* si une infos n'est pas renseign??e, on la laisse par d??faut */
        const firstName = req.body.firstName || user.firstName;
        const lastName = req.body.lastName || user.lastName;
        const pseudo = req.body.pseudo || user.pseudo;
        const password = req.body.password || user.password;

        const updateUser = await userController.update({
            id,
            firstName,
            lastName,
            pseudo,
            password
        });
        if(!updateUser) {
            res.status(404).end();
        }
        else {
            res.json(updateUser);
            res.status(200).end();
        }
    }

});


userRoutes.delete("/:id", async function(req, res) {
    const id = req.params.id;

    if(id === null)
    {
        res.status(400).end();
    }
    const userController = await UserController.getInstance();
    const userRemove = await userController.removeById(id);

    if(userRemove)
    {
        /**
         * todo
         *  -pour chaques tache de l'utilisateur:
         *      -si la tache est en cours : on mets cette t??che en status "?? faire" && le user id ?? null
         *      -si la t??che a en status "finis" on mets juste le user_id ?? "null"
         */
        /*const taskController = await TaskController.getInstance();
        let taskUser;

        while ( (taskUser = await taskController.getTaskByIdUser(id)) !== null)
        {
            await taskController.removeById(taskUser.id.toString())
        }*/
        res.status(204).end();
    }
    else
    {
        res.status(404).end();
    }
});

userRoutes.post("/connection",async function (req, res){
    const pseudo = req.body.pseudo;
    const password = req.body.password;
    if(pseudo === undefined || password === undefined){
        res.status(400).end();
    }
    const userController = await UserController.getInstance();
    const user = await userController.connection(pseudo,password);

    if(!user){
        res.status(404).end();
        return;
    }else{
        res.json(user);
        res.status(204).end();
    }

});

export {
    userRoutes
};
