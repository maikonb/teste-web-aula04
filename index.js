const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const Quote = require('./quote.model');

app.use(cors());
app.use(express.json());

const db_host = 'localhost';
const db_port = 27017;
const db_db   = 'quotes';   
const mongoURI = `mongodb:\/\/${db_host}:${db_port}/${db_db}`;
mongoose.connect(mongoURI, { useNewUrlParser: true });

app.get('/', (req, res) => { 
    res.send('Hello NodeJS');
})

app.get('/quotes', (req, res) => { 
    Quote.find({})
        .then((quotes) => res.send(quotes))
        .catch((err) => {
            console.log(err);
            res.status(500).send({});
        })        
})

app.post('/quotes', (req, res) => {

    let quote = {
        author: req.body.author,
        quote: req.body.quote
    }

    Quote.create(quote)
        .then((quote) => res.status(201).send(quote))
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        })        
})

app.patch('/quotes', (req,res) => {
    Quote.findById(req.body._id)
        .then((quote) => {
            quote.author = req.body.author;
            quote.quote = req.body.quote;
            quote.save()
                .then((quote) => res.status(200).send(quote))
                .catch(() => res.status(500).send())
        })
        .catch((err) => {
            console.error(err);
            res.status(404).send();
        })
})

app.delete('/quotes/:id', (req, res) => {
    Quote.findByIdAndDelete(req.params.id)
        .then(()  => res.status(200).send())
        .catch(() => res.status(400).send());
})

app.listen(3000, "0.0.0.0", () => {
    console.log('Escutando a porta 3000...');
});

process.on("SIGINT", () => {
    console.log("Saindo da aplicação...")
    mongoose.connection.close()
        .then(() => {
            console.log("Banco de dados desconectado.")
            console.log("Bye.")
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        })
})