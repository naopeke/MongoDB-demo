//初期に投入するデータ
const mongoose = require('mongoose');
const Product = require('./models/product');

//expressとは関係ない. node.jsからseeds.jsを実行するスクリプトファイルのようなもの
mongoose.connect('mongodb://localhost:27017/farmStand', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('MongoDBコネクションOK');
      })
      .catch(err => {
        console.log('MongoDBコネクションエラー')
      });

// const p = new Product({
//     name: "ルビーグレープフルーツ",
//     price: 198,
//     category: '果物'
// });
// p.save().then(p =>{
//     console.log(p);
// }).catch(e => {
//     console.log(e);
// })

//node seeds.js

//mongosh
//show dbs
//use farmStand
//show collections

const seedProducts = [
  {
      name: 'ナス',
      price: 98,
      category: '野菜'
  },
  {
      name: 'カットメロン',
      price: 480,
      category: '果物'
  },
  {
      name: '種無しスイカのカット',
      price: 380,
      category: '果物'
  },
  {
      name: 'オーガニックセロリ',
      price: 198,
      category: '野菜'
  },
  {
      name: 'コーヒー牛乳',
      price: 298,
      category: '乳製品'
  },
];

//１つでもバリデーションが通らないと、全てデータは入らない
Product.insertMany(seedProducts)
.then(res => {
  console.log(res);
}).catch(e => {
  console.log(e);
});