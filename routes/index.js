var express = require('express');
var phridge = require('phridge');
var router = express.Router();

var phantom;
var page;

phridge.spawn({
}).then(function (data) {
  console.log("PhantomJS Started");
  phantom = data;
  phantom.openPage("http://www.cnn.com/").then(function(data) {
    try {
      page = data;
      console.log("Website Loaded");
      page.run(function() {
        try {
          console.log("Sizing Page");
          this.viewportSize = {width: 1024, height: 728};
          console.log("Adding JQuery to page");
          this.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
          console.log("Rendering page");
          this.render("tmp/output.png");
        } catch(ex) {
          console.log(ex);
        }
      }).then(function() {
        console.log("Page Rendered");
      })
    } catch (ex) {
      console.log(ex);
    }
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/data', function(req, res, next) {
  res.send({test:true});
});

router.get("/layout", function(req,res, next) {
  page.run(function() {
    return this.evaluate(function() {
      var elements = [];
      jQuery("*").each(function(index, element) {
        try {
          if((jQuery(element).width() > 20 || jQuery(element).height() > 20)) {
            elements.push({position: jQuery(element).position(),
              width:jQuery(element).width(),
              height: jQuery(element).height(),
              border: jQuery(element).css("border-style") == "solid",
              background: jQuery(element).css("background-image"),
              'background-color': jQuery(element).css("background-color"),
              type: jQuery(element).get(0).tagName});
          }
        } catch (ex) {}
      });
      return elements;
    })
  }).then(function(result) {
    res.send({data: result});
  })
});

module.exports = router;
