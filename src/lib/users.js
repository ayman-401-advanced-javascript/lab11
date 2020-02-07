/* eslint-disable strict */
'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// let SECRET = 'lovleysecret';

// let db = {};
// let users = {};
const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

users.pre('save', async function(){
  if (!users.username) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
// users.statics.authenticateBasic = async function(auth) {
//   console,log('++++++++++++++++++++',auth)
//   return this.findOne({username:auth.user})
//     .then(user=>{
//       console,log(user)
//       return bcrypt.compare(auth.pass, user.password)
//     .then(valid => valid ? user : null);
//     });
//   }
users.statics.authenticateBasic = function(auth) {
  return this.findOne({username:auth.username})
    .then(user => user.passCompare(auth.password))
    .catch(console.error);
};
users.methods.passCompare = function(password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};
users.methods.generateToken = function(user) {
  let token = jwt.sign({ username: user.username}, process.env.SECRET);
  return token;
};

// users.save = async function(record) {
// if (!db[record.username]) {
//     record.password = await bcrypt.hash(record.password, 5);

//     db[record.username] = record;
//     record.save()
//     return record;
//   }

//   return Promise.reject();
// }

// users.authenticateBasic = async function(user,pass) {
//   let valid = await bcrypt.compare(pass, db[user].password);
//   return valid ? db[user] : Promise.reject();
// }

// users.generateToken = function(user) {
//   let token = jwt.sign({ username: user.username}, SECRET);
//   return token;
// }

users.statics.list =  async function(){
  let results = await this.find({});
  return results;
};
module.exports = mongoose.model('users',users);