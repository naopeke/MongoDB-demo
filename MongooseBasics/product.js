const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopApp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('コネクションOK');
      })
      .catch(err => {
        console.log('コネクションエラー')
      });

      //https://mongoosejs.com/docs/connections.html Operation Buffering　
      //このおかげで、connectがどうなったかを気にせずにModelを定義し使える

      const productSchema = new mongoose.Schema({
        name: { 
            type: String,
            required: true,
            //最大の文字数１０ 
            maxLength: 10
        },
        price: {
            type: Number,
            required: true,
            //最小値０, エラーメッセージも追加できる
            min:[0, 'priceは０より大きい値にしてください']
        },
        onSale: {
            //デフォルトでonSaleがfalseになる
            type: Boolean,
            default: false
        },
        categories:[String],
        qty:{
            online: {
                type: Number,
                default:0
            },
            inStore: {
                type: Number,
                default:0
            }
        },
        size: {
            type: String,
            //有効な値を決めており、それ以外の値だとエラーがでる
            enum: ['S', 'M', 'L']
        }

        //以下のようにデフォルトでサイクリングが入るようにもできる。Stringの配列。
        // categories:{
        //     type: [String],
        //     default: ['サイクリング']
        // }
      });

      //なるべくfunctionを使うように。アロー関数だと定義した場所のthisになってしまうため。
      // node
      // .load product.js
      // const p = new Product({name:'バッグ', price: 1000})
      // p.greet()
      productSchema.methods.greet= function(){
        console.log('greet関数からハロー');
        // node product.jsで出る ヘルメットからの呼び出し
        console.log(`- ${this.name}からの呼び出し`);
      }

      //------------------------------------------------------
      // toggleOn...
        // これでもできるが毎回書かないといけないので、
        // foundProduct.onSale = !foundProduct.onSale;
        // foundProduct.save();
        // これにする。（エラー処理省略）セール中を切り替えるfalseがtrue、categoriesにアウトドア追加
        productSchema.methods.toggleOnSale = function (){
            this.onSale = !this.onSale;
            return this.save();
        }

        productSchema.methods.addCategory = function (newCat){
            this.categories.push(newCat);
            return this.save();
        }

      //-----------------------------------------------
      //statics
      //https://mongoosejs.com/docs/guide.html#statics
      //thisはProduct
      productSchema.statics.fireSale = function(){
        return this.updateMany({}, {onSale:true, price:0});
      }

      const Product = mongoose.model('Product', productSchema);


      // node product.js で呼び出せる
      // consoleには、ヘルメットからの呼び出し、とでる。thisはヘルメット
      const findProduct = async() => {
        const foundProduct = await Product.findOne({name:'ヘルメット'});
        // foundProduct.greet();

        console.log(foundProduct);
        //toggleのほうが早いのでawait
        await foundProduct.toggleOnSale();
        console.log(foundProduct);
        await foundProduct.addCategory('アウトドア');
        console.log(foundProduct);

      }

    //   findProduct();

    Product.fireSale().then(msg => console.log(msg));


    //--------------------------------------------------------------------
    //   const bike = new Product({
    //     name: 'ヘルメット',
    //     price: 2980,
    //     categories: ['サイクリング', '安全装備']
    //     // 数字123を入れるとString '123'となる
    //   });

    //   bike.save()
    //   .then(data => {
    //     console.log('成功！');
    //     console.log(data);
    //   })
    //   .catch(err => {
    //     console.log('エラー');
    //     console.log(err.errors.name.properties.message);
    //   })

      //Mongosh
      //show dbs
      //use shopApp


      //node
      //node product.js

      //定義されていない余分なデータ color:redを追加しても、新規作成はされるが、データベースには残らない

      //https://mongoosejs.com/docs/schematypes.html
      //All Schema Types, require, default, maxLength, min ...etc

      //データ更新のときには、Schemaが効かない。バリデーションをする必要 runValidators:trueにする。（デフォルトはfalse）
      //https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
    //   const bike = new Product({
    //     name: '空気入れ',
    //     price: 1980,
    //     categories: ['サイクリング']
    //     // 数字123を入れるとString '123'となる
    //   });

    //   Product.findOneAndUpdate({ name:'空気入れ'}, {price: -1980}, {new:true, runValidators:true})
    //   .then(data => {
    //         console.log('成功');
    //         console.log(data);
    //     })
    //     .catch(err => {
    //         console.log('エラー');
    //         console.log(err);
    //     })


    //------------------------------------------------
    // インスタンスメソッド
        //bikeというインスタンス。bike.save()のsaveはインスタンスメソッド

    //　スタティックメソッド
    // Product