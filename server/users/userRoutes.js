var userController = require('./userController');
var User = require('./userModel')

var authenticate = function(req, res, next){ 
  console.log(req.headers.authorization);
  if(req.headers.authorization === undefined){ 
    console.log("Token is incorrect.")
    res.status(401).send("Token is incorrect, redirect to signin.")
  }else{
    User.findOne({ 
      token: req.headers.authorization.split(' ')[1]
    }).exec(function(err, data){ 
      if(err) { 
        console.log('Error in getting user '+ err);
        res.status(500).send("Error in getting user from database.");
      } else if(!data){ 
        console.log("Token is incorrect.")
        res.status(401).send("Token is incorrect, redirect to signin.")
      } else { 
        req.service_uid = data.utilityAPIData.service_uid
        req.account_uid = data.utilityAPIData.account_uid
        next();
      }
    });
  }

  
};

module.exports = function(app){ 
  app.post('/signup', userController.signUp);
  app.post('/signin', userController.signIn);
  app.get('/api/user/meterreadings/', authenticate, userController.getUserMeterReadings); 
  app.post('/api/user/changePGE', authenticate, userController.changePGEData);
  app.get('/logout', authenticate, userController.logOut);

  //-----------FOR DEVELOPMENT ONLY--------------------//
  app.post('/dev/deleteInactiveUsers', userController.deleteInactiveUsers)
}