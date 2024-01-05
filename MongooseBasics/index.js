
const mongoose = require('mongoose');

// getting-started.js
// main().catch(err => console.log(err));

// async function main() {
//     try {
//       await mongoose.connect('mongodb://127.0.0.1:27017/test', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//       });
//       console.log('接続OK');
//     } catch (error) {
//       console.error('接続エラー:', error.message);
//     }
//     // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
//   }
  
// then catchでも可能
mongoose.connect('mongodb://localhost:27017/movieApp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('コネクションOK');
      })
      .catch(err => {
        console.log('コネクションエラー')
      });

// {
//     title: 'Amadeus',
//     year: 1986,
//     score: 9.2,
//     rating: 'R'
// }

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
});

//単数形、1文字目は大文字. Classを作る
const Movie = mongoose.model('Movie', movieSchema);

const amadeus = new Movie ({ title: 'Amadeus', year: 1986, score: 9.2, rating: 'R'});

//Mongoose v5
//$ node
// .load index.js
// amadeus.save()
// amadeus.score = 9.5
// amadeus.save()

//mongosh
//use movieApp
//db.movies.find()

//-----------------------------------------------------

//Mongooseで複数のデータを挿入
// Movie.insertMany([
//   { title: 'Amelie', year:2001, score:8.3, rating: 'R'},
//   { title: 'Alien', year:1979, score:8.1, rating: 'R'},
//   { title: 'The Iron Gian', year:1999, score:7.5, rating: 'RG'},
//   { title: 'Stand By Me', year:1986, score:8.6, rating: 'R'},
//   { title: 'Moonrise Kingdom', year:2012, score:7.3, rating: 'PG-13'},
// ]).then(data => {
//   console.log('成功！');
//   console.log(data);
// })


//-----------------------------------------------------

//Mongooseで検索
//https://mongoosejs.com/docs/api/query.html#Query.prototype.find()
// Queryを返す

//node
//.load index.js
//Movie.find({}).then(data => console.log))
//Movie.find({year: {$gte: 2010}}).then(data => console.log(data))
//Movie.findOne({})

// app.get('/movies') 
//Movie.findOne({_id:'65942d7e706752bb91854e6f'}).then(m => console.log(m))
//Movie.findById('65942d7e706752bb91854e6f').then(m => console.log(m))

//-----------------------------------------------------
//Mongooseで更新
//https://mongoosejs.com/docs/api/model.html#Model.updateMany()

//Mongoose
//Movie.updateOne({title: 'Amadeus}, {year:1984}).then(res => console.log(res))
//Movie.find({title: {$in: ['Amadeus', 'Stand By Me']}}, {score:10}).then(res => console.log(res))
//Movie.findOneAndUpdate({title: 'The Iron Gian'}, {title: 'The Iron Giant'}).then(m => console.log(m))

//更新後の結果がコンソールで出るように第３引数に {new:true}を追加
//Movie.findOneAndUpdate({title: 'The Iron Giant'}, {score: 7.8}, {new:true}).then(m => console.log(m))

//Movie.deleteOne({_id:'65942d1585e081bac585dcd2'}).then(msg => console.log(msg))
//Movie.findOneAndDelete({title: 'Alien'}).then(m => console.log(m))

