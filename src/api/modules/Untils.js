const MESSAGESCONFIG = require('../Messages')
const MESSAGES = MESSAGESCONFIG.messages

function to(promise) {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
}

let _error = (errorCode, err, messageERR = "") => {
  return {
    errorCode: errorCode,
    message: MESSAGES[errorCode],
    messageERR,
    err: err ? err : 'ERROR'
  }
}

let _success = (succesCode) => {
  return {
    errorCode: succesCode,
    message: MESSAGES[succesCode]
  }
}

module.exports = {
  to,
  _error,
  _success
}