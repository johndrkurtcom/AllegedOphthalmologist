if(!process.env.DEPLOY === 'production'){
  var tokens = require('./../tokens');
}
else{
  var tokens = {
    utilityAPIToken: process.env.utilityAPIToken,
    wattTimeAPIToken: process.env.wattTimeAPIToken
  }
}
console.log('tokens ', tokens);

module.exports = tokens;