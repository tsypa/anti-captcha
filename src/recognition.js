var request = require('request');

function RecognitionService(service, token) {
  this.service = service;
  this.token = token;
}

RecognitionService.prototype._checkErrors = function(body) {
  var errors = [
    'ERROR_WRONG_USER_KEY', 'ERROR_KEY_DOES_NOT_EXIST', 'ERROR_ZERO_BALANCE',
    'ERROR_NO_SLOT_AVAILABLE', 'ERROR_ZERO_CAPTCHA_FILESIZE', 'ERROR_TOO_BIG_CAPTCHA_FILESIZE',
    'ERROR_WRONG_FILE_EXTENSION', 'ERROR_IMAGE_TYPE_NOT_SUPPORTED', 'ERROR_IP_NOT_ALLOWED',
    'IP_BANNED', 'CAPCHA_NOT_READY', 'ERROR_KEY_DOES_NOT_EXIST',
    'ERROR_WRONG_ID_FORMAT', 'ERROR_CAPTCHA_UNSOLVABLE', 'ERROR_WRONG_CAPTCHA_ID'
  ];

  return new Promise(function(resolve, reject) {
    if (errors.indexOf(body) === -1) {
      resolve(body);
    } else {
      reject(body);
    }
  });
};


// Request probably should be taken out into a separate method.
RecognitionService.prototype.getBalance = function() {
  return new Promise(function(resolve, reject) {
    var url = this.service + '/res.php?action=getbalance&key='+this.token;
    request.get(url, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(this._checkErrors(body));
      }
    }.bind(this));
  }.bind(this));
};

module.exports = function(service, token) {
  return new RecognitionService(service, token);
};
