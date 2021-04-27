const {config} = require("dotenv");
config();
import express,{Express} from "express";
import {buildRoutes} from "./routes";
import bodyParser from "body-parser";
import {SequelizeManager} from "./models";

const app:Express = express();

async function main(){
    const sequelize = await SequelizeManager.getInstance();
    console.log(sequelize);
}
main().then(function (){});


app.use(bodyParser.json());

buildRoutes(app);

const port = process.env.PORT || 3000;

app.listen(port,function (){
    console.log(`Listening on ${port}`);
});