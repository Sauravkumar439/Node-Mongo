const Employee = require("../model/model");
const User = require("../model/loginmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPass,
    });
    user
      .save()
      .then((user) => {
        res.json({
          message: "User Added Successfully!",
        });
      })
      .catch((error) => {
        res.json({
          message: "An Error Occured ",
        });
      });
  });
};

const login = (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
    (user) => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.json({
              error: err,
            });
          }
          if (result) {
            let token = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME
            });
            let refreshtoken = jwt.sign({ name: user.name }, process.env.REFRESH_TOKEN_SECRET, {
              expiresIn: process.env.REFRESH_TOKEN_SECRET_TIME
            });
            res.status(200).json({
              message: "Login Successful!",
              token,
              refreshtoken,
            });
          } else {
            res.status(200).json({
              message: "Password does not matched!",
            });
          }
        });
      } else {
        res.json({
          message: "No user found!",
        });
      }
    }
  );
};

const index = (req, res, next) => {
    Employee.paginate({}, { page: req.query.page, limit: req.query.limit })
    .then(response=> {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: "An error Occured: "+error
    })
})
};

// Show single employee
const show = (req, res, next) => {
  let employeeID = req.body.employeeID;
  Employee.findById(employeeID)
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
      });
    });
};

//Adding Employee

const store = (req, res, next) => {
  let employee = new Employee({
    name: req.body.name,
    designation: req.body.designation,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
  });
  if (req.file) {
    employee.avatar = req.file.path;
  }
  employee
    .save()
    .then((response) => {
      res.json({
        message: "Employee Added Successfully!",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
      });
    });
};

//Update employee

const update = (req, res, next) => {
  let employeeID = req.body.employeeID;

  let updatedData = {
    name: req.body.name,
    designation: req.body.designation,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
  };
  Employee.findByIdAndUpdate(employeeID, { $set: updatedData })
    .then(() => {
      res.json({
        message: "Employee updated successfully!",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
      });
    });
};

// delete an employee
const destroy = (req, res, next) => {
  let employeeID = req.body.employeeID;
  Employee.findOneAndRemove(employeeID)
    .then(() => {
      res.json({
        message: "Employee deleted successfully!",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
      });
    });
};

const refreshToken = (req,res,next) => {
    const refreshToken = req.body.refreshToken
    jwt.verify(refreshToken, 'qwert1234', function(err, decode) {
         if(err) {
             res.status (400).json({
                 err
             })
         }
         else {
             let token = jwt.sign( {name: decode.name}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME}  )
             let refreshToken = req.body.refreshToken
             res.status(200).json({
                 message:"Token Refreshed Successfully!",
                 token, refreshToken
             })
            }
        })
    }
module.exports = {
  register,
  login,
  refreshToken,
  index,
  show,
  store,
  update,
  destroy,
};
