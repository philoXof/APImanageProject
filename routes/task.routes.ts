import express from "express";


const taskRoutes = express();

taskRoutes.get("/:id",async function(req,res){

});

taskRoutes.get("/",async function(req,res){
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
});

taskRoutes.post("/add",async function(req, res) {

});

taskRoutes.put("/:id",async function(req,res){

});

taskRoutes.delete("/:id", async function(req, res) {

});

export {
    taskRoutes
};