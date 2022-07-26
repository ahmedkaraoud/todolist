import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { taskEntity } from "../entities/task";
 
class taskController{

    static listAll = async (req: Request, res: Response) => {
      const taskRepository = getRepository(taskEntity);
      const task = await taskRepository.find({
        select: ["id", "title",  "description","state","prioritylevel","dateOfCompletion"] 
      });
    res.send(task);
    };
    
    static getOneById = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id: number = parseInt(req.params.id);
    
      //Get the task from database
      const taskRepository = getRepository(taskEntity);
      try {
        const task = await taskRepository.findOne(id, {
        select: ["id", "title",  "description","state","prioritylevel","dateOfCompletion"] 
            //We dont want to send the passwords on response
        });
        res.status(201).send(task);
      } catch (error) {
        res.status(404).send("task not found");
      }
      
    };

    
    
    static newtask = async (req: Request, res: Response) => {
      //Get parameters from the body
      let { title, description ,state, prioritylevel,dateOfCompletion} = req.body;
      let task = new taskEntity();
      task.title = title;
      task.description = description;
      task.prioritylevel = prioritylevel;
      task.dateOfCompletion = dateOfCompletion;
      task.state=state;
      //Validade if the parameters are ok
      if(prioritylevel>=1&&prioritylevel<=5){
      const taskRepository = getRepository(taskEntity);
      try {
        await taskRepository.save(task);
      } catch (e) {
        res.status(409).send("ref already in use");
        return;
      }
    
      //If all ok, send 201 response
      res.status(201).send("task created");
      const errors = await validate(task);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      }
      else{
        task.prioritylevel=-1;
        const taskRepository = getRepository(taskEntity);
      try {
        await taskRepository.save(task);
      } catch (e) {
        res.status(409).send(e);
        return;
      }
    
      //If all ok, send 201 response
      res.status(201).send("task created");
      const errors = await validate(task);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      }
    };
    
    static edittask = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;
    
      //Get values from the body
      const { title, description ,state, prioritylevel,dateOfCompletion} = req.body;
    
      //Try to find task on database
      const taskRepository = getRepository(taskEntity);
      let task;
      try {
        task = await taskRepository.findOne(id);
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send("task not found");
        return;
      }
    
      //Validate the new values on model
      task.title = title;
      task.description = description;
      task.prioritylevel = prioritylevel;
      task.dateOfCompletion = dateOfCompletion;
      task.state=state;
      if(prioritylevel>=1&&prioritylevel<=5){

      const errors = await validate(task);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }    
      try {
        await taskRepository.save(task);
      } catch (e) {
        res.status(409).send(e);
        return;
      }
      res.status(201).send("task edited");
    }
    else{
        task.prioritylevel=-1;
        const errors = await validate(task);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }    
      try {
        await taskRepository.save(task);
      } catch (e) {
        res.status(409).send(e);
        return;
      }
      res.status(201).send("task edited");
    }
    };

    static deletetask = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;
    
      const taskRepository = getRepository(taskEntity);
      let task: taskEntity;
      try {
        task = await taskRepository.findOne(id);
      } catch (error) {
        res.status(404).send("task not found");
        return;
      }
      taskRepository.delete(task)
    
      res.status(201).send("deleted");
    };
}
    
export default taskController;