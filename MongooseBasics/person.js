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


const personSchema = new mongoose.Schema({
    first: String,
    last: String
});

//https://mongoosejs.com/docs/api/virtualtype.html
personSchema.virtual('fullName').get(function(){
    return `${this.first} ${this.last}`;
});

//https://mongoosejs.com/docs/middleware.html
//ルールを守らないといけない。preにnextを最後に呼ぶか、asyncでプロミスが返るように
personSchema.pre('save', async function(){
    this.first = 'ほげ'
    this.last  = 'もげ'
    console.log('今から保存するよ');
});

personSchema.post('save', async function(){
    console.log('保存したよ');
})

//> const ken = new Person({first:'Ken', last: 'Fukuyama'})
//> ken


const Person = mongoose.model('Person', personSchema);

//node
// .load person.js
//> const yamada = new Person({first: 'Taro', last: 'Yamada'})
//undefined
//> yamada
//{ _id: 6595a7e56e6155799eb05b3b, first: 'Taro', last: 'Yamada' }
//> yamada.fullName
//'Taro Yamada'
//> yamada.save()
//Promise {
//    <pending>,


//Mongosh
//use shopApp
//show collections
//db.people.find()