import {Express} from "express";
import {taskRoutes} from "./task.routes";
import {userRoutes} from "./user.routes";

export function buildRoutes(app:Express){
    app.use("/user",userRoutes);
    app.use("/task",taskRoutes);
}