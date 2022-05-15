const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dfuca.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoriesCollection = client.db('Inventories1').collection('InventoriesItem1');
        
        app.get('/inventorie', async (req, res) => {
            const query = {};
            const cursor = inventoriesCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        });

        app.get('/inventorie/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const inventory =  await inventoriesCollection.findOne(query);
            res.send(inventory);
        });

        //post
        app.post('/inventorie', async(req, res) => {
            const newInventorie = req.body;
            const result = await inventoriesCollection.insertOne(newInventorie);
            res.send(result);
        });

        //Update
        app.put('/inventorie/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const updateInventorie = req.body;
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    quantity:updateInventorie.quantity
                }
            }
            const result = await inventoriesCollection.updateOne(query, updateDoc, options);
            res.send(result);
        });

        //Delete
        app.delete('/inventorie/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await inventoriesCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running warehouse server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});