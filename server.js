const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

const url = 'mongodb+srv://leoconstant:leo@cluster0.ari5v8s.mongodb.net/?retryWrites=true&w=majority'
const dbName = 'palindrome'

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.listen(1001, function() {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, 
        (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
    
    
}); 

app.get('/', (req, res) => {
    db.collection('palindrome').find().toArray((err, result) => {
        if (err) return console.log(err)
        console.log({palindrome: result})
        res.render('index.ejs', {palindrome: result})
      })
    
})

app.post('/checkWord', (req, res) => {
  console.log(req.body.word)
  let word = `${req.body.word}`
  let wordPal = word.toLowerCase().split('').reverse().join('')
          
  if ( word.toLowerCase() === wordPal) {
      conclusion = 'Yes! A Palindrome'
  } else {
      conclusion = 'This is NOT what we want!'
  }

    db.collection('palindrome').insertOne({word: req.body.word, outcome: conclusion})
      .then(result => {
        console.log('saved to database')
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })