import express from "express"

const router = express.Router()

import usersData from "../Data/usersData.js"

let nextId = 11

router.get("/", (req,res) =>
{
    res.status(200).json(usersData);
});

router.get("/:id" , (req,res) =>
{
    const {id} = req.params;
    const user = usersData.find(user => user.id === parseInt(id));
    if (user) {
        res.status(200).json(user)
    }else{
        res.status(404).send("Bulunamadı.");
    }
});

router.post("/", (req,res,next) =>
{
    let newUser = req.body;
    if(newUser.name && newUser.username && newUser.email)
    {
        newUser.id = nextId;
        nextId++;
        usersData.push(newUser);
        res.status(201).json(newUser);
    }
    else
    {
        next({statusCode:400, errorMessage: "Verilerinin tamamını girin."});
    }
});

router.delete("/:id",(req,res)=>
{
    const deleteId = req.params.id;
    const deleteUser = usersData.find((user) => user.id === Number(deleteId))
    if(deleteUser)
    {
        data = usersData.filter((user) => user.id !== Number(deleteId));
        res.status(204).end();
    }
    else
    {
        res.status(404).json({errorMessage: "Sistemde yok"});
    }
});

export default router;