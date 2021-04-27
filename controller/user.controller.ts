import {ModelCtor} from "sequelize";
import {UserCreationProps, UserInstance} from "../models/user";
import {SequelizeManager} from "../models";

export class UserController{
    User:ModelCtor<UserInstance>;

    private static instance: UserController;

    public static async getInstance(): Promise<UserController> {
        if(UserController.instance === undefined) {
            const {User} = await SequelizeManager.getInstance();
            UserController.instance = new UserController(User);
        }
        return UserController.instance;
    }

    private constructor(User: ModelCtor<UserInstance>) {
        this.User = User;
    }

    public async getAll(limit:number,offset:number):Promise<UserInstance[] | null>{
        return await this.User.findAll({
             limit,
             offset
        });
    }

    public async getById(id:string):Promise<UserInstance|null>{
        return await this.User.findOne({where: {
                id
            }});
    }

    public async removeById(id:string):Promise<Boolean>{
        const userToDelete = await this.getById(id);
        if(userToDelete === null)
        {
            return false;
        }
        else
        {
            try
            {
                await this.User.destroy({
                    where:{
                        id: userToDelete.id
                    }
                });
                return true;
            }
            catch (err)
            {
                console.error(err);
                return false;
            }
        }
    }

    public async add(props: UserCreationProps): Promise<UserInstance | null> {
        return await this.User.create({
            ...props
        });
    }

    public async update(options: UserCreationProps):Promise<UserInstance | null>{
        if(options.id === undefined) return null;
        const userUpdate = await this.getById(options.id.toString());

        if(userUpdate === null)
        {
            return null;
        }
        else
        {
            return await userUpdate.update({

                name: options.name
            }, {
                where: {
                    id: options.id
                }
            });
        }
    }

}