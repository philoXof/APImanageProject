import express from "express";
import {UserController} from "../controller/user.controller";

const userRoutes = express();

userRoutes.get("/:id",async function(req, res){
    const id = req.params.id;
    if(id===undefined){
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.getById(id);
    if(user!==null){
        res.json(user);
        res.status(201).end();
    }else {
        res.status(409).end();
    }
});

userRoutes.get("/",async function(req, res){
    const userController = await UserController.getInstance();
    const userList = await userController.getAll();
    if(userList!==null){
        res.json(userList);
        res.status(201).end();
    }else {
        res.status(409).end();
    }
});

userRoutes.post("/",async function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if(firstName === undefined || lastName === undefined )
    {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.add({
        firstName,
        lastName
    });
    if(user!==null){
        res.status(201);
        res.json(user);
    }else {
        res.status(409).end();
    }
});

userRoutes.put("/:id",async function(req, res){
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
        res.status(204).end();
    }
    else
    {
        res.status(404).end();
    }
});

export {
    userRoutes
};