# anti-captcha

# Installation

`npm install anti-captcha`

# Usage

```JavaScript
var anticaptcha = require('anti-captcha');

var service = anticaptcha('http://anti-captcha.com', 'API_KEY');

function printCaptchaText(captcha) {
  console.log(captcha.text);
}

function captchaNotRecognized(captcha) {
   // do something for test then return actual state
   return true; // stub
}

function printReportBad(captcha) {
  console.log('Report recorded');
}

service.downloadImage('https://i.imgur.com/lGQdxBy.png').then(function(base64) {
  service.uploadCaptcha(base64, {phrase: true})
  .then(function(captcha) {
    service.getText(captcha).then(function(captcha) {
      printCaptchaText(captcha);
      if (captchaNotRecognized(captcha)) {
        service.reportBad(captcha).then(printReportBad);
      }
    });
  });
}).catch(function(error) {
    console.log('Error:', error);
});
```
