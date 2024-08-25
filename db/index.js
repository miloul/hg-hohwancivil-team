require('dotenv').config();
const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;


const express = require('express');

const Joi = require('joi');

const schema_write = Joi.object({
    //id: Joi.number().integer().required(),
    id: Joi.string().required(),
    title: Joi.string().required(),
    species: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    personnel: Joi.number().integer().required(),
    salary: Joi.number().integer().required(),
    contact: Joi.string().required(),
    mealSleep: Joi.string().required(),
    workingHour: Joi.number().integer().required(),
    location: Joi.string().required(),
    details: Joi.string().required(),
    isClosed: Joi.boolean().required()
})


const { CosmosClient } = require('@azure/cosmos');

const app = express();
const port = 3000;


const databaseId = "write";
const containerId = "relation";

const client = new CosmosClient({ endpoint, key });

// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// 데이터 추가 API
/*app.post('/add-item', async (req, res) => {
    const { id, content } = req.body;
    const container = client.database(databaseId).container(containerId);

    try {
        const { resource: createdItem } = await container.items.create({ id, content });
        res.status(201).send(createdItem);
    } catch (error) {
        res.status(500).send(error.message);
    }
});*/

app.post('/write', async (req, res) => {
    const {error} = schema_write.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    
    const { id, title, species,startDate,endDate,personnel,salary,contact,mealSleep,workingHour,location,details } = req.body;
    const container = client.database(databaseId).container(containerId);

    try {
        const { resource: createdItem } = await container.items.create({ id, title, species,startDate,endDate,personnel,salary,contact,mealSleep,workingHour,location,details });
        res.status(201).send(createdItem);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



// 데이터 조회 API
app.get('/items', async (req, res) => {
    const container = client.database(databaseId).container(containerId);
    
    try {
        const { resources: items } = await container.items.readAll().fetchAll();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
