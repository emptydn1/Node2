var express = require('express');
var router = express.Router();

/* kết nối tới mongodb */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/* chuyển thành objectID */
var chuyenthanhobjectid = require('mongodb').ObjectID;


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'huy';

// Use connect method to connect to the server
MongoClient.connect(url,{useNewUrlParser: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/them', function(req, res, next) {
  res.render('them', { title: 'Express' });
});

router.post('/them', function(req, res, next) {
  var data = {
    "ten" : req.body.ten,
    "dienthoai" : req.body.dt
  };

  const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Insert some documents
    collection.insert(data, function(err, result) {
      assert.equal(err, null);
      console.log("success");
      callback(result);
    });
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    insertDocuments(db, function() {
      client.close();
    });
  });

  res.redirect('/');
});



/* xem du lieu*/
router.get('/xem', function(req, res, next) {
  const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      callback(docs);
    });
  }


  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    const db = client.db(dbName);

    findDocuments(db, function(dulieu) {
      res.render('xem', { title: 'Express', data:dulieu });
      client.close();
    });
  });
});



/* xoa du lieu*/
router.get('/xoa/:idcanxoa', function(req, res, next) {
  var id = chuyenthanhobjectid(req.params.idcanxoa);

  const removeDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Delete document where a is 3
    collection.deleteOne({ _id:id }, function(err, result) {
      assert.equal(err, null);
      console.log("Removed the document with the field a equal to 3");
      callback(result);
    });    
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    removeDocument(db, function() {
      client.close();
      res.redirect('/xem');
    });
  });

});





/* sửa */
router.get('/sua/:idcansua', function(req, res, next) {
  var id = chuyenthanhobjectid(req.params.idcansua);

  const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Find some documents
    collection.find({_id:id}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      callback(docs);
    });
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    const db = client.db(dbName);

    findDocuments(db, function(dulieu) {
      res.render('sua',{data:dulieu})
      client.close();
    });
  });
});



router.post('/sua/:idcansua', function(req, res, next) {
  var id = chuyenthanhobjectid(req.params.idcansua);

  var data = {
    "ten" : req.body.ten,
    "dienthoai" : req.body.dt
  };

  
  const updateDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ _id : id }
      , { $set: data }, function(err, result) {
      assert.equal(err, null);
      console.log("Updated the document with the field a equal to 2");
      callback(result);
    });  
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    updateDocument(db, function() {
      res.redirect('/xem');
      client.close();
    });
  });
});


module.exports = router;
