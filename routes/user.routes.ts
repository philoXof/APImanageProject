import express from "express";


const userRoutes = express();

userRoutes.get("/:id",async function(req, res){

});

userRoutes.get("/",async function(req, res){
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
});

userRoutes.post("/add",async function(req, res) {

});

userRoutes.put("/:id",async function(req, res){

});

userRoutes.delete("/:id", async function(req, res) {

});

export {
    userRoutes
};