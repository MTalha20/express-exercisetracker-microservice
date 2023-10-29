const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const users = require("./models/users.js");
const exercise = require("./models/exercise.js");
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

const mySecret = process.env['MONGO_URL'];

async function connectMongodb(url) {
  await mongoose.connect(url)
    .then(() => {
      console.log('Connected to the database ')
    })
    .catch((err) => {
      console.error(`Error connecting to the database. n${err}`);
    });
}

connectMongodb(mySecret);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", function(req, res) {
  let name = req.body.username;
  console.log(name);
  let newUser = new users({
    name:name
  })
  newUser.save()
    .then((data)=>{
    res.json({
      _id: data["_id"],
      username: data["name"]
    })
  })
    .catch((err)=>{
    res.send(err);
  });
});

app.get("/api/users", function(req,res){
      users.aggregate([
        {
          $project: {
            username: "$name",
          }
        },
      ])
  .exec()
  .then((data)=>{
    res.send(data);
  })
  .catch((err)=>{
    throw err;
  });
});

app.post("/api/users/:_id/exercises", function(req,res){
  var {description, duration, date} = req.body;
  let user_id = req.params._id;
  var current_date;
  if (date){
    current_date = new Date(date).toDateString();
    console.log(current_date)
  }
  else{
    current_date = new Date().toDateString();
    console.log(current_date);
  }
  users.findById(user_id)
  .then((data)=>{
    let new_exercise = new exercise({
      userid: user_id,
      username: data["name"],
      date: current_date,
      duration: duration,
      description: description
    });
    new_exercise.save()
      .then((data)=>{
      res.json({
        _id: data["userid"],
        username: data["username"],
        date: data["date"].toDateString(),
        duration: data["duration"],
        description: data["description"]
      });
      })
      .catch((err)=>{
        throw err;
      });
  })
  .catch((err)=>{
    throw err;
  });
});

app.get("/api/users/:_id/logs", function(req,res){
  console.log(`original url ${req.originalUrl}`)
  let id = req.params._id;
  console.log(`id recev. ${id}`);
  var count;
  var name;
  var from = req.query.from;
  var to = req.query.to;
  let limit = req.query.limit;
  console.log(`from: ${from}, to: ${to}, limit: ${limit}`);
  if(from || to || limit){
    console.log("if path");
    users.findById(id)
    .then((data)=>{
      name = data["name"];
      console.log(`data found by userid ${name}`);
      let matchStage = {
        userid: id,
      };

      if (from) {
        matchStage.date = {
          $gte: new Date(from),
          $lte: new Date(to),
        };
      }
      let aggregationPipeline = [
          {
            $match: matchStage,
          },
          {
            $project: {
              __v: 0,
              userid: 0,
              _id: 0,
              username: 0,
            },
          },
        ];
      if (limit) {
        aggregationPipeline.push({ $limit: parseInt(limit) });
      }
      const aggregationPromise = exercise.aggregate(aggregationPipeline)
        .exec()
          aggregationPromise.then((data) => {
          console.log("second promise")
          var i = 0;
            for(i = 0 ; i < data.length; i++){
            data[i]["date"] = data[i]["date"].toDateString();
          }
          res.json({
              _id: id,
            username: name,
            from: new Date(from).toDateString(),
            to: new Date(to).toDateString(),
            count: data.length,
              log: data
          });
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err)=>{
      throw err;
    });
  }
  else{
    console.log("else path");
    users.findById(id)
    .then((data)=>{
      console.log(`data found by userid ${data}`);
      name = data["name"];
        exercise.aggregate([
          {
            $match: {
              userid: id,
            }
          },
          // {
          //   $addFields: {
          //     date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
          //   }
          // },
          {
            $project: {
              __v: 0,
              userid: 0,
              _id: 0,
              username: 0,
              // date:0
            }
          },
        ])
        .exec()
        .then((data)=>{
          var i = 0;
          for(i = 0 ; i < data.length; i++){
          data[i]["date"] = data[i]["date"].toDateString();
        }
        res.json({
          username: name,
          count: data.length,
          _id: id,
          log: data
        })
      })
      .catch((err)=>{
        throw err});
    })
    .catch((err)=>{throw err});
  }
});


const listener = app.listen(process.env.PORT || 5000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
