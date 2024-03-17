const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



// sazedulislam9126
// r7IWspiHHcJvdlfX

// console.log(process.env.USER_DB)
// console.log(process.env.PASS_DB)


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster01.vqd3zkx.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// JWT VERIFYING 
const verifyJWT = (req, res, next) => {
    console.log('hitting the verifying ')
    const authorization = req.headers.authorization;
    console.log(authorization)
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'unauthorized token ' })
    }
    const token = authorization.split(' ')[1]
    console.log('inside of verifying JWT Token', token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send({ error: true, message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next()
    })

}


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const serviceCollection = client.db("carDoctor").collection("services");
        const bookingsCollection = client.db("carDoctor").collection("bookings");

        // jwt
        app.post('/jwt', (req, res) => {
            const user = req.body;
            console.log(user)
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            });
            console.log(token)
            res.send({ token })
        })


        // Services Routes 
        // get data form mongoDB
        app.get('/services', async (req, res) => {
            const sort = req.query.sort;
            const search = req.query.search;
            console.log(search)
            // const query = {}
            const query = {title: {$regex: search, $options: 'i'}}
            const options = {
                // sort matched documents in descending order by rating
                sort: { 
                    "price": sort === 'asc' ? 1 : -1 
                },
            };
            const cursor = serviceCollection.find(query, options)
            const result = await cursor.toArray()
            res.send(result)
        })

        // get single data using id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            // specific 
            const options = {
                projection: { title: 1, service_id: 1, price: 1, img: 1 },
            };
            const result = await serviceCollection.findOne(query, options)
            res.send(result)
        })


        // bookings routes 
        // read some data in same user
        app.get('/bookings', verifyJWT, async (req, res) => {
            const decoded = req.decoded;
            console.log('came back after verifying', decoded)

            if (decoded.email !== req.query.email) {
                return res.status(403).send({ error: 1, message: 'forbidden access' })
            }

            // console.log(req.headers)
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingsCollection.find(query).toArray()
            res.send(result);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            // console.log(booking)
            const result = await bookingsCollection.insertOne(booking)
            res.send(result);

        })
        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updateBooking = req.body;
            console.log(updateBooking)
            const updated = {
                $set: {
                    status: updateBooking.status
                }
            }
            const result = await bookingsCollection.updateOne(filter, updated)
            res.send(result)


        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: new ObjectId(id) }
            const result = await bookingsCollection.deleteOne(query);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);





app.get('/', (req, res) => {
    res.send('Welcome to CAR DOCTOR Server')
})


app.listen(port, () => {
    console.log(`Car Doctor server is Running on ${port}`)
})