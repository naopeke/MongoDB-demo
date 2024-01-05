// npm i express ejs mongoose@5

//nodemon index.js

const express = require('express');
const app = express();
const path = require('path');

const Product = require('./models/product');
const methodOverride = require('method-override');

const mongoose = require('mongoose');
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.post('products'), (req, res) => {　が使えるために追加.フォームのリクエストがきたときはパースしてreq.bodyにいれる指示
app.use(express.urlencoded({extended: true}));

//put やpatchのリクエストが投げられるようになる
app.use(methodOverride('_method'));

//編集画面でカテゴリが自動で出るようにするためにハードコーディングをしてapp.get('/products/new', (req, res) =>{ res.render('products/new', { categories });}) カテゴリ追加
const categories = ['果物', '野菜', '乳製品'];

app.get('/products', async (req, res) => {
  const { category } = req.query;
  if(category){
    //そのカテゴリがあれば、そのカテゴリで絞り込む
    const products = await Product.find({category});
    // const products = await Product.find({category: category});　同じcategoryなので１つに省略↑
    res.render('products/index', {products, category});
  } else {
    //そのカテゴリがない場合は全部
    const products = await Product.find({});
    res.render('products/index', {products, category: '全'});
  }
})

// //test
// app.get('/dog', (req, res)=>{
//     res.send('bow wow');
// })

// app.get('/products', async (req, res)=>{
//   //find()は時間のかかる非同期処理のものなのでasync awaitをつかう
//     const products = await Product.find({});
//     // console.log(products);
//     // res.send('商品一覧を表示予定');
//     res.render('products/index', {products});
// });

app.get('/products/new', (req, res) =>{
  res.render('products/new', { categories });
})

//新規作成画面
app.post('/products', async (req, res) =>{
// console.log(req.body);
// res.send('商品を作成します');
const newProduct = new Product(req.body);
await newProduct.save();
console.log(newProduct);
res.redirect(`/products/${newProduct._id}`);
})

app.get('/products/:id', async(req, res)=>{
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product);
  // res.send('詳細ページ');
  res.render('products/show', { product });
})

//商品の更新
app.get('/products/:id/edit', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/edit', { product, categories });
});

// method-override を npm i method-override
app.put('/products/:id', async(req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  res.redirect(`/products/${product._id}`);
  // console.log(req.body);
  // res.send('PUT');
})

//商品の削除
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  res.redirect('/products');
  // res.send('削除');
});

//カテゴリで絞り込む /products?category=果物



app.listen(3000, ()=>{
    console.log('ポート3000でリクエスト待受中...');
})