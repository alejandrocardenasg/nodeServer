const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'ci';

let insertOne = async(json) =>{
    //  Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('datos');

    const insertResult = await collection.insertOne(json);
    client.close()
    return true;
}

let getAll = async() =>{

    //  Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    const findResult = await db.collection('datos').find({}).toArray();
    client.close()
    return findResult;
}

let getOne = async(find) =>{

    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    const findResult = await db.collection('datos').find({"id_radiacion": find}).toArray();
    client.close()
    return findResult;
    
}

module.exports = {
    insertOne,
    getAll
}