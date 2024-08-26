require('dotenv').config();
const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;


const express = require('express');

const Joi = require('joi');

const schema_write = Joi.object({
    //id: Joi.string().required(),
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

const schema_user = Joi.object({
    //id: Joi.string().required(),
    name: Joi.string().required(),
    phoneNumber: Joi.string().required()
})

const schema_relation = Joi.object({
    //id: Joi.string().required(),
    writeId: Joi.string().required(),
    isJob: Joi.boolean().required(),
    applicant: Joi.string()
})

//-------------------------------------


const { CosmosClient } = require('@azure/cosmos');

const app = express();
const port = 3000;


const databaseId = "write";
const write = "write";
const user = "user";
const relation = "relation";

const client = new CosmosClient({ endpoint, key });

//-----------------------

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
    
    //const writeId = uuidv4(); // 글 id
    //const relationId = uuidv4(); // relation id

    const { title, species,startDate,endDate,personnel,salary,contact,mealSleep,workingHour,location,details } = req.body;
    //const { id, title, species,startDate,endDate,personnel,salary,contact,mealSleep,workingHour,location,details } = req.body;

    const containerWrite = client.database(databaseId).container(write);
    const containerRelation = client.database(databaseId).container(relation);

    try {
        const { resource: createdWriteItem } = await containerWrite.items.create({ 
            title, species, startDate, endDate, personnel, salary, contact, mealSleep, workingHour, location, details });
            //id: writeId, 
        var isJob = salary > 0;

        const { resource: createdRelationItem } = await containerRelation.items.create({ writeId: createdWriteItem.id, isJob, applicant: null }); // 첫 공지에 지원자가 없으므로 null
            //id: relationId, 
        console.log(createdWriteItem.id);
        console.log(createdRelationItem.id);
        res.status(201).send({createdWriteItem, createdRelationItem});
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.delete('/write/:id', async (req, res) => {
    const itemId = req.params.id; // URL 파라미터에서 id 가져오기
    const container = client.database(databaseId).container(write);

    try {
        // relation 아이템 삭제
        //const { resource: deleteRelationItem } = await ;

        // write 아이템 삭제
        const { resource: deletedItem } = await container.item(itemId, itemId).delete();
        res.status(204).send(); // 삭제 후 204 No Content 응답
    } catch (error) {
        if (error.code === 404) {
            res.status(404).send('아이템을 찾을 수 없습니다.'); // 아이템이 존재하지 않을 경우
        } else {
            res.status(500).send(error.message); // 기타 에러 처리
        }
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