import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const filename = path.join(__dirname, "db.json")

const writeData = data => fs.writeFile(filename, JSON.stringify(data))

const readData = async () => {
    const data = await fs.readFile(filename, 'utf-8')
    if (!data) {
        return null
    }
    return JSON.parse(data)
}

const getAll = readData

const getPage = async (start) => {
    const data = await getAll()
    const pages = Math.ceil( data.length / 10.0 )
    const res = {data: data.slice((start-1)*10, start*10), active: start, pages: pages}

    return (res.data.length == 0 ? null : res)
}

const getSortedPage = async (start) => {
    const data = await getAll()
    const pages = Math.ceil( data.length / 10.0 )
    data.sort((a, b) => a.name.localeCompare(b.name))
    const res = {data: data.slice((start-1)*10, start*10), active: start, pages: pages}

    return (res.data.length == 0 ? null : res)
}

const getById = async (id) => {
    const data = await readData()
    for (const el of data) {
        if (el.id == id) {
            return el
        }
    }
    return null
}

const getByName = async (name) => {
    const data = await readData() 
    const searchStr = name.replaceAll('%20', ' ').toLowerCase();
    console.log("Поиск танца по фрагменту:", searchStr);
    
    let arr = data.filter(el => el.name.toLowerCase().includes(searchStr));
    
    const res = {data: arr, active: 0, pages: 0}
    return (res.data.length == 0 ? null : res)
}

const updateById = async (id, value) => {
    let data = await readData()
    let flag = true
    for (let el of data) {
        if (el.id == id) {
            el.name = value.name
            el.desc = value.desc
            flag = false
        }
    }
    if (flag) {
        return null
    }
    await writeData(data)
    return { "id": id, "name": value.name, "desc": value.desc }
}

const deleteById = async (id) => {
    let data = await readData()
    let index = -1
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            index = i
        }
    }

    if (index == -1) {
        return null
    }

    const deletedElem = data.splice(index, 1)[0]
    await writeData(data)
    return deletedElem
}

const createElem = async (value) => {
    let data = await readData()
    if (!data) {
        data = []
    }
    
    let maxID = 0;
    if (data.length > 0) {
        maxID = Math.max(...data.map(el => parseInt(el.id) || 0));
    }
    
    const elem = {
        "id": maxID + 1,
        "name": value.name,
        "desc": value.desc
    }
    
    data.push(elem)
    await writeData(data)
    
    return elem
}

export { getAll, getById, updateById, deleteById, createElem, getByName, getPage, getSortedPage }