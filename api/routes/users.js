const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");


router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {//para ver si trae ese q ya existe
        //error 422 unprocessable Entity
        //error 409 conflict
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              repeatPaswword: hash,
              name: req.body.name,
              surNames: req.body.surNames, 
              country: req.body.country,
              birthday: req.body.birthday

            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created successfully",
                  createdUser: {
                    email: result.email,
                    name: result.name,
                    surNames: result.surNames, 
                    country: result.country,
                    birthday: result.birthday,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + result._id
                    }
                }
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.get('/', (req, res, next) => {
  User.findOne()
  //selecciona lo que se le especifica
   .select('user email password _id')
   //.populate('product','name')//selecciona solo el nombre de ese fkey
   .exec()
   .then(docs => {
      res.status(200).json({
         //devolvera a detalla la informacion con mas info
        count: docs.length,
        users: docs.map(doc => {
          return {
            _id: doc._id,
            email: doc.email,
            password: doc.password,
            repeatPaswword: doc.repeatPaswword,
            name: doc.body.name,
            surNames: doc.body.name, 
            country: doc.body.surNames,
            birthday: doc.body.surNames,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/user/singup' + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
     });
 });
 router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for(const ops of req.body){
       updateOps[ops.propName] = ops.value; 
    }
    User.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'User updated',
            request:{
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    

});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;