# recognition

# Installation

`npm install recognition`

# Usage

```JavaScript
var recognition = require('recognition');

var service = recognition('http://anti-captcha.com', 'API_KEY');

function printCaptchaText(captcha) {
  console.log(captcha.text);
}

service.downloadImage('https://i.imgur.com/lGQdxBy.png').then(function(base64) {
  service.uploadCaptcha(base64, {phrase: true})
  .then(function(captcha) {
    service.getText(captcha).then(printCaptchaText);
  });
}).catch(function(error) {
    console.log('Error:', error);
});
```
