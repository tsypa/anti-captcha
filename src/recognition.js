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

RecognitionService.prototype.downloadImage = function(url) {
  return new Promise(function(resolve, reject) {
    request.get(url, function(error, response, body) {
      if (error) {
        return reject(error)
      }
      return resolve('' + new Buffer(body).toString('base64'));
    });
  });
};

RecognitionService.prototype.uploadCaptcha = function(base64, parameters) {
  var url = this.service + '/in.php';

  var formData = {
    method: 'base64',
    key: this.token,
    body: base64
  }

  return new Promise(function(resolve, reject) {
    request.post({url: url, form: formData}, function(error, response, body) {
      if (error) {
        return reject(error);
      }

      this._checkErrors(body).then(function(body) {
        return resolve({id: parseInt(body.toString().split('|')[1])})
      }).catch(function(error) {
        return reject(error);
      });
    }.bind(this));
  }.bind(this));
};

RecognitionService.prototype.getText = function(captcha) {
  return new Promise(function(resolve, reject) {
    if (!captcha.id) {
      return reject('You should pass an {id: \'captcha id\'}');
    }

    var url = this.service+'/res.php?action=get&id='+captcha.id+'&key='+this.token;

    var interval = setInterval(function(url) {
      request.get(url, function(error, response, body) {
        if (error) {
          return reject(error);
        }

        this._checkErrors(body).then(function(body) {
          clearInterval(interval);
          return resolve({id: captcha.id, text: body.toString().split('|')[1]})
        })
        .catch(function(error) {
          if ('CAPCHA_NOT_READY' !== error) {
            clearInterval(interval);
            return reject(error);
          }
        });

      }.bind(this));
    }.bind(this), 3000, url);
  }.bind(this));
};

module.exports = function(service, token) {
  return new RecognitionService(service, token);
};
