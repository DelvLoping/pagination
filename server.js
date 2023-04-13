const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const createConnection = mysql.createConnection;
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
const connection = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to database: ', err);
    } else {
        console.log('Successfully connected to database!');
    }
});


app.get('/films/', (req, res) => {
    let limit = parseInt(req.query.limit)??10
    if(!parseInt(req.query.page)||parseInt(req.query.page)<1){
        req.query.page=1
    }
    let offset = limit * (parseInt(req.query.page)-1)

    let order = req.query.order
    let sort = req.query.sort


    if(!['asc','desc'].includes(sort)){
        sort = 'asc'
    }
    if(!['title','genre','rentals','rentalPrice','ranking'].includes(order)){
        order = 'title'
    }
    let sql = `SELECT f.title,f.rental_rate as price,f.rating as ranking ,c.name as genre, count(r.rental_id) as rentals FROM film f LEFT JOIN film_category fc on f.film_id=fc.film_id LEFT JOIN category c on fc.category_id=c.category_id LEFT JOIN inventory i on f.film_id=i.film_id LEFT JOIN rental r on i.inventory_id=r.inventory_id group by f.title,f.rental_rate,f.rating,c.name ORDER BY ${connection.escapeId(order)} ${sort} limit ? offset ? `
    return connection.query(sql,[limit,offset], (err, results) => {
        if (err) {
            console.log('Error fetching films: ', err);
            res.status(500).send('Error fetching films');
        } else {
            // Récupérer le nombre total d'éléments
            let sqlCount = 'SELECT COUNT(film_id) as count FROM film';
            connection.query(sqlCount, (err, countResult) => {
                if (err) {
                    console.log('Error fetching count: ', err);
                    res.status(500).send('Error fetching count');
                } else {
                    // Ajouter le nombre total d'éléments à la réponse paginée
                    let totalCount = countResult[0].count;
                    res.status(200).json({
                        count: totalCount,
                        data: results
                    });
                }
            });
        }
    });

});


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;