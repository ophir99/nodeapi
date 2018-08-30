const express = require('express');
const app = express();

const cors = require('cors');

const mongoose = require('mongoose');
const user = require('./User');

const jwt = require('jsonwebtoken');
const posts = require('./Posts');
app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://adminx:adminx9@ds257627.mlab.com:57627/dbforng').then(()=>{
    console.log('Connected to DB')
})
.catch(
    (err)=>{
        console.log(err)
    }
);

app.post('/user', async (req, res)=>{
    const user_ = new user({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try{
        const result = await user_.save().then((data)=>{
            res.send({data: data});
        })
        .catch((err)=>{
            throw(err);
        })
    }
    catch(err){
        res.send({err:err});
    }
});

app.get('/users', async (req, res)=>{
    try{
        const user_ = await user.find().then(
            (data)=>{
                res.send({data: data})
            }
        ).catch(
            (err)=>{
                throw(err)
            }
        );
    }
    catch(err){
        res.send({err:err})
    }
});


app.post('/posts', async (req, res)=>{
    const posts_ = new posts({
        title: req.body.title,
        desc: req.body.desc,
        createdBy: req.body.author
    });

    try{
        await posts_.save().then(
            (data)=>{
                res.send({data})
            }
        )
        .catch(
            (err)=>{
                throw(err)
            }
        )
    }
    catch(err){
        res.status(500).send({err});
    }
});
app.get('/posts', async (req, res)=>{
    try{
        await posts.find().then(
            (data)=>{
                res.send({data})
            }
        )
        .catch(
            (err)=>{
                throw(err)
            }
        )
    }
    catch(err){
        res.status(500).send({err});
    }
});
app.get('/post', async (req, res)=>{
    const id = req.query.id;
    try{
        await posts.find({_id: id}).then(
            (data)=>{
                res.send({data})
            }
        )
        .catch(
            (err)=>{
                throw(err)
            }
        )
    }
    catch(err){
        res.status(500).send({err});
    }
});

app.delete('/post/:id', async (req, res)=>{
    const id = req.params.id;
    try{
        await posts.deleteOne({_id: id}).then(
            (data)=>{
                res.send({data})
            }
        )
        .catch(
            (err)=>{
                throw(err)
            }
        )
    }
    catch(err){
        res.status(500).send({err});
    }
})

app.post('/login', async (req, res)=>{
    console.log(req.body);
    try{
        await user.find({name:req.body.name, password: req.body.password}).then(
            (result)=>{
                if(result.length > 0){
                    console.log(result);
                    const token_ = jwt.sign({name: result[0].name}, 'AuthentcatedName');
                    res.send({msg: 'UserFound', token: token_})
                }
                else{
                    res.send({msg: 'User not Found'})
                }
            }
        )
        .catch(
            (err)=>{
                throw(err)
            }
        )
    }
    catch(err){
        res.send({err:err})
    }
});
app.listen(8900, ()=>{
    console.log('Initiated');
})