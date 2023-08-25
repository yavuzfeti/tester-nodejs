import express from "express"
import postgresClient from "../config/db.js"

const router = express.Router()

router.get("/",async (req,res)=>
{
    try
    {
        const text = "SELECT * FROM users"
        const all = await postgresClient.query(text)

        return res.status(200).json(all.rows)
    }
    catch(e)
    {
        console.log("Hata oluştu: "+e.message)
        return res.status(400).json({message: e.message})
    }
})

router.get("/:id", async (req, res) =>
{
    try
    {
        const id = req.params.id;
        const text = "SELECT * FROM users WHERE id = $1";
        const values = [id];
        const {rows} = await postgresClient.query(text, values);

        return res.status(200).json(rows[0])
    }
    catch(e)
    {
        console.log("Hata oluştu: " + e.message);
        return res.status(400).json({ message: e.message });
    }
});

router.post("/",async (req,res)=>
{
    try
    {
        const text = "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *"
        const values = [req.body.email,req.body.password]
        const {rows} = await postgresClient.query(text,values)

        return res.status(201).json(rows[0])
    }
    catch(e)
    {
        console.log("Hata oluştu: "+e.message)
        return res.status(400).json({message: e.message})
    }
})

router.put("/:id",async (req,res)=>
{
    try
    {
        const {id} = req.params
        const text = "UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *"
        const values = [req.body.email,req.body.password,id]
        const {rows} = await postgresClient.query(text,values)

        if(!rows.length)
        {
            return res.status(404).json({message: "kullanıcı bulunamadı"})
        }

        return res.status(200).json(rows[0])
    }
    catch(e)
    {
        console.log("Hata oluştu: "+e.message)
        return res.status(400).json({message: e.message})
    }
})

router.delete("/:id",async (req,res)=>
{
    try
    {
        const {id} = req.params
        const text = "DELETE FROM users WHERE id = $1 RETURNING *"
        const values = [id]
        const {rows} = await postgresClient.query(text,values)

        if(!rows.length)
        {
            return res.status(404).json({message: "kullanıcı bulunamadı"})
        }

        return res.status(200).json({deletedUser: rows[0]})
    }
    catch(e)
    {
        console.log("Hata oluştu: "+e.message)
        return res.status(400).json({message: e.message})
    }
})

router.post("/login",async (req,res)=>
{
    try
    {
        const text = "SELECT * FROM users WHERE email = $1 AND password = $2"
        const values = [req.body.email,req.body.password]
        const {rows} = await postgresClient.query(text,values)

        if(!rows.length)
        {
            return res.status(404).json({message: "kullanıcı bulunamadı"})
        }
        else
        {
            return res.status(200).json({message: "kullanıcı bulundu"})
        }
    }
    catch(e)
    {
        console.log("Hata oluştu: "+e.message)
        return res.status(400).json({message: e.message})
    }
})

export default router