# MongoDB CRUB Operations
[Insert Documents](#insertdocuments) | [Find Documents](#finddocuments) | [Update Documents](#updatedocuments) | [Delete Documents](#deletedocuments)

## Insert Documents
https://www.mongodb.com/docs/manual/tutorial/insert-documents/  

データベースを表示
```
> show dbs
admin 0-000GB
config 0.000GB
local 0.000GB
```
animalShelterというデータベースを使う
```
> use animalShelter
switched to db animalShelter

> db
animalShelter
```
コレクションを表示（まだデータがないため何も表示されない）
```
> show collections
```
データを挿入する
```
> db.dogs.insertOne({name: 'ポチ', age:3, breed: 'corgi', catFriendly: true})
{
  "acknowledged" : true,
  "insertedId" : ObjectId("6109e797c1ff97f28d245fdf")
}

> show collections
dogs
```
dogsのデータを探す
```
> db.dogs.find()
{ "_id": ObjectId("6109e797c1ff97f28d245fdf"), "name":"ポチ", "age":3, "breed":"corgi", "catFriendly":true}
//_id 存在していなければMongoDBが自動生成
```
dogsのデータに挿入する
```
>db.dogs.insert([{name: 'ハチ', breed: 'golden', age:14, catFriendly:false}, {name: 'チョコ', breed: 'chihuahua', age:17, catFriendly: true}])
BulkWriteResult({
  "writeErrors": [].
  "writeConcernErrors": [],
  "nInserted" : 2,
  "nMatched" : 0,
  "nModified" : 0,
  "nRemoved" : 0,
  "upserted" : []
})

> db.dogs.find()
{ "_id" : ObjectId("...."), "name":"ポチ"...}
{ "_id" : ObjectId("...."), "name":"ハチ"...}
{ "_id" : ObjectId("...."), "name":"チョコ"...}
```
catsのデータに挿入する
```
> db.cats.insert({ name: 'タマ', age:6, dogFriendly: false, breed: 'scottish fald'})
WriteResult({ "nInserted": 1})

> db.cats.find()
{ "_id": ObjectId("...."), "name":"タマ"...}

```

## Find Documents
https://www.mongodb.com/docs/v6.2/reference/method/db.collection.find/

特定のドキュメントだけ検索
```
db.collection.find(query, projection, options)
```

breedがcorgiのものだけ完全検索（大文字小文字の区別あり）
```
> db.dogs.find({breed: 'corgi'})
```
複数該当(cursorがリターン。documentだとメモリを使うため）
```
> db.dogs.find({catFriendly: true})
```

１つのみ検索（最初にヒットしたオブジェクト）（documentがリターン）
```
> db.dogs.findOne({catFriendly:true})
```
複数条件も可
```
> db.dogs.find({catFriendly:true, age;17})
```

## Update Documents
更新対象を探してから更新する  
https://www.mongodb.com/docs/v6.2/tutorial/update-documents/
```
// { $set: { <field1>: <value1>, ... } }

> db.dogs.updateOne({name: 'ポチ'}, {$set: {age: 5, breed: 'lab}})
```
もし、存在しないキーを追加したら、それも追加される
```
> db.dogs.updateOne({name: 'ポチ'}, {$set: {color: 'chocolate'}})
```
catFriendly:trueのデータのものに、isAvailable:falseを追加する
```
> db.updateMany({catFriendly: true}, {$set: {isAvailable: false }})
{ "acknowledged": true, "matchedCount":2, "modifiedCount":2}
```
$currentDate　指定したキーに現在の日時を設定できる
```
db.cats.updateOne({age:6}, {$set: {age:7}, $currentDate: {lastChanged: true})
```
```
//replaceOne()　既存のオブジェクトを完全に置き換える

```

## Delete Documents
https://www.mongodb.com/docs/v6.2/tutorial/remove-documents/
```
> db.cats.find()
{ "_id": ObjectId("...."), "name":"タマ"...}

> db.cats.deleteOne({name: 'タマ'})
{ "acknowledged" : true, "deletedCount":1}

> db.cats.find()
//削除されている
```
```
< db.dogs.find()
{ "_id": ObjectId("...."), "name":"ポチ"...}
{ "_id": ObjectId("...."), "name":"ハチ"...}
{ "_id": ObjectId("...."), "name":"チョコ"...}
```
複数削除
```
> db.dogs.deleteMany({isAvailable: false})
{ "acknowledged" : true, "deletedCount":2}

< db.dogs.find()
{ "_id": ObjectId("...."), "name":"ハチ"...}
```

全削除　括弧内を空にする
```
> db.dogs.deleteMany({})

```

##　MongoDBで使える演算子
```
≫ db.dogs.insert([
... { name: 'ポチ', breed: 'Shiba', age: 3, weight: 25, size: 'M', personality: { catFriendly: true, childFriendly: true } },
... { name: 'ハチ', breed: 'Husky', age: 3, weight: 65, size: 'L', personality: { catFriendly: false, childFriendly: true } },
... { name: 'ココ', breed: 'Chihuahua', age: 8, weight: 7, size: 'S', personality: { catFriendly: false, childFriendly: false } },
... { name: 'マロン', breed: 'Labrador', age: 2, weight: 110, size: 'L', personality: { catFriendly: false, childFriendly: true } },
... { name: 'ソラ', breed: 'Corgi', age: 10, weight: 31, size: 'M', personality: { catFriendly: true, childFriendly: true } },
... { name: 'チョコ', breed: 'Corgi', age: 13, weight: 27, size: 'M', personality: { catFriendly: true, childFriendly: true } },
])
BulkWriteResult({
  "writeErrors" : [ ],
  "writeConcernErros": [ ],
  "nInserted" : 6,
  "nMatched" : 0,
  "nModified" : 0,
  "nRemoved" : 0,
  "upserted" : []
})

//ネストされたドキュメントの値で絞り込み（ドット．で並べる）
> db.dogs.find({'personality.childFriendly':true, age:10})
```
Query and Projection Operators  
https://www.mongodb.com/docs/v6.2/reference/operator/query/  

Greater than  
Syntax: { field: { $gt: value } }  
```
> db.dogs.find({ $gt: 8}})
```
Greater than equal  
Syntax: { field: { $gte: value } }  
```
> db.dogs.find({ $gte: 10})
```
Less than  
Syntax: { field: { $lt: value } }  
```
> db.dogs.find({ $lt: 10})
```
In  あるいは
{ field: { $in: [<value1>, <value2>, ... <valueN> ] } }  
```
//ShibaかCorgiに一致するもの
> db.dogs.find({breed: {$in:['Shiba', 'Corgi']})

> db.dogs.find({breed: {$in:['Shiba', 'Corgi', 'Chihuahua']}, age:{$lt: 10})
```
Not in  
Syntax: { field: { $nin: [ <value1>, <value2> ... <valueN> ] } }  
```
//ShibaでもCorgiでもChihuahuaでもないもの、かつ年齢が１０歳未満
> db.dogs.find({breed: {$nin:['Shiba', 'Corgi', 'Chihuahua']}, age:{$lt: 10})
```



