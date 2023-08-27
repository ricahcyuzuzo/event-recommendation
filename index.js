const express = require('express');
const cors = require('cors');
const { connection } = require('./config');

connection.connect();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "Welcome to events API." 
    });
});

app.get('/recommendations', async (req, res) => {
    const userId = req.query.id;
    
    connection.query('SELECT eventtype FROM tblbooking WHERE ServiceID=' + userId, (error, results, fields) => {
        const eventsArray = results;
        const eventTypesArray = eventsArray.map(event => event.eventtype);

        const eventTypesString = eventTypesArray.join(',');
        const query = 'SELECT id FROM eventcategories WHERE category IN (?)';
        connection.query(query, [eventTypesString], (err, results) => {
            const eventsArray = results;
            const eventTypesArray = eventsArray.map(event => event.id);
    
            const eventTypesString1 = eventTypesArray.join(',');
            const query1 = 'SELECT * FROM events WHERE categoryid IN (?)';
            connection.query(query1, [eventTypesString1], (err, results) => {
                return res.status(200).json({
                    recommendations: results 
                })
            });
        });

    });
    // res.status(200).json({ 
    //     message: ""
    // });
})

app.use((req, res) => {
    res.type('json').status(404).json({
        message: '404 Endpoint not found',
        status: 404
    });
});

app.listen(3402, () => console.log('Server is running on http://localhost:' + 3402));