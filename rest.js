import express from "express"
import bodyParser from "body-parser"
import { getAll, getById, updateById, deleteById, createElem, getByName, getPage, getSortedPage } from "./store.js"
import path from "path"
import { fileURLToPath } from "node:url"

const app = express()
app.use(express.static("public"))
app.use(bodyParser.json())

app.set("view engine", "ejs")
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req,res) => {
    res.sendFile("index.html", {root: "public/"})
})

app.get("/chat", (req, res) => {
    res.render("chat")
})


app.get("/items", async (req, res) => {
    const data = await getAll()
    res.render("allCards", { data })
})

app.get("/items/page/:start", async (req, res) => {
    const page = await getPage(req.params.start)
    if (!page) {
        res.sendStatus(404)
    } else {
        res.render("allCards", page)
    }
})

app.get("/items/sorted/page/:start", async (req, res) => {
    const page = await getSortedPage(req.params.start)
    if (!page) {
        res.sendStatus(404)
    } else {
        res.render("allCards", page)
    }
})

app.get("/items/:id", async (req, res) => {
    const data = await getById(req.params.id)
    if (!data) {
        res.status(404).send("Ошибка: Танец с таким ID не найден в базе данных.");
    } else {
        res.render("card", data)
    }
})

app.get("/items/search/:name", async (req, res) => {
    const page = await getByName(req.params.name)
    if (!page) {
        res.status(404).send("Ничего не найдено по вашему запросу.");
    }
    else {
        res.render("allCards", page)
    }
})

app.post("/items", async (req, res) => {
    const value = req.body
    if (!Object.hasOwn(value, "name") || !Object.hasOwn(value, "desc")){
        res.sendStatus(400)
    } else {  
        const data = await createElem(req.body)
        if (!data) {
            res.status(404)
        } else {
            res.status(201).json(data)
        }
    }
})

app.put("/items/:id", async (req, res) => {
    const id = req.params.id
    const value = req.body
    if (!Object.hasOwn(value, "name") || !Object.hasOwn(value, "desc")){
        res.sendStatus(400)
    } else {  
        const data = await updateById(id, req.body)
        if (!data) {
            res.sendStatus(404)
        } else {
            res.status(201).json(data)
        }
    }
})

app.delete("/items/:id", async (req, res) => {
    const id = req.params.id
    const data = await deleteById(id)
    if (!data) {
        res.sendStatus(404)
    } else {
        res.status(201).json(data)
    }
})

export { app }