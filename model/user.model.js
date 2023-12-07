const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },


  avatar: {
    type: String,
    default: 'https://static.wixstatic.com/media/8a8033_a738085f564f4d43aa34edebaebae5b5~mv2_d_1600_1600_s_2.jpg/v1/fit/w_1000%2Ch_1000%2Cal_c%2Cq_80/file.jpg', 
  },


  email: {
    type: String,
    required: true,
    unique: true,
  },


  password: {
    type: String,
    required: true,
  },



});


userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    next();

  } catch (error) {

    next(error);

  }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = {
  
    UserModel

}
