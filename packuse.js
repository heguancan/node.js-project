var express = require('express');
var db = require('./pack.js');
var app = express();
var bp = require('body-parser');
var md5 = require('js-md5');
var cookieParser = require('cookie-parser');
var ObjectId = require('mongodb').ObjectID;
app.use(bp.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use('/',express.static('../item'));

app.get('/cookie',function(req,res){

    if(req.cookies.isVisit){
        console.log(req.cookies);
        res.send("再次欢迎访问");
    }else {
        res.cookie('isVisit', 1, {maxAge: 60 * 1000});
        res.send("欢迎第一次访问");
  }

});
app.use(function(req, res, next) {
        //设置跨域访问
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        if (req.method == 'OPTIONS') {
            res.send(200); /*让options请求快速返回*/
        } else {
            next();
        }
    })
    //判断用户名是否已存在
app.post('/user', function(req, res) {

    console.log(req.body);
    data = {
        "name": req.body.name
    }

    db.find('user', data, function(err, result) {
        if (err) {
            console.log(err);
        }
        // console.log(result.length);
        // res.send(result);
        if (result.length != 0) {
            res.send("1");
        }
    })
});
    // 插入用户数据
app.post('/insert', function(req, res) {

    console.log(req.body);
    data = {
        "name": req.body.name,
        "password": md5(req.body.password),
        "email": req.body.email
    }

   db.insertOne('user', data, function(err, result) {
                if (err) {
                    console.log(err)
                };
                res.send(result.ops);
            });

});



// 查找用户数据
app.post("/find", function(req, res) {
    console.log(req.body);
    data = {
        "name": req.body.name,
        "password": md5(req.body.password),
    }

    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.find('user', data, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length != 0) {
            res.send("1");
        }else{
            res.send("0");
        }
    });
});





   //判断学生是否已存在
app.post('/student', function(req, res) {

    console.log(req.body);
    data = {
        "name": req.body.name
    }

    db.find('student', data, function(err, result) {
        if (err) {
            console.log(err);
        }
        // console.log(result.length);
        // res.send(result);
        if (result.length != 0) {
            res.send("1");
        }
    })
});
    // 插入数据
app.post('/insertstudent', function(req, res) {

    console.log(req.body);
    data = {
        "name": req.body.name,
        "class": req.body.class,
        "sex": req.body.sex,
        "age":req.body.age
    }
    console.log(data);

   db.insertOne('student', data, function(err, result) {
                if (err) {
                    console.log(err)
                };
                res.send(result.ops);
            });

});



// 查找数据
app.post("/findallstudent", function(req, res) {
    console.log(req.body);
    var data = {
    
    }

    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.find('student', data, function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.send(JSON.stringify(result));
    });
});

// 查找数据
app.post("/pageallstudent", function(req, res) {
    console.log(req.body);
    var data = {
    
    }
    var row=req.body.row;
    var rows=req.body.rows;
    var rows_=rows-4*row;
        if(rows_>=0){
            rows=rows_;
            row=4;
        }else{
            row=rows%4;
            rows=0;
            
        }
    console.log(rows);
    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.findpage('student', data,row,rows,function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.send(JSON.stringify(result));
    });
});


app.post("/findstudent", function(req, res) {
    console.log(req.body);
    var data={
      name: {$regex: req.body.name, $options:'i'}
    }
 
    console.log(data);
    // data = JSON.parse(data);
    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.find('student', data, function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.send(JSON.stringify(result));
    });
});


//删除
app.post("/deletestudent", function(req, res) {

    var data = {"_id":ObjectId(req.body.id)};

    db.deleteMany("student", data, function(err, result) {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});

//修改
app.post("/updatestudent", function(req, res) {

    console.log(req.body);

    var data1 = {"_id":ObjectId(req.body.id)};


    var data2 = {  
          "name":req.body.name,
          "class":req.body.class,
          "sex":req.body.sex,
          "age":req.body.age
        }

    console.log(data1);
    console.log(data2);

    db.updateMany(
        "student",
    data1, { $set : data2 ,$currentDate: { lastModified: true } },

        function(err, result) { 
            if (err) {
                console.log(err);
            }
            res.send(result);
        }
    );
});



app.listen(8080)