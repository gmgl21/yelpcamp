var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    {
      name:"Cloud's Rest",
      image: "https://source.unsplash.com/dQn37qrUzDI",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna condimentum mattis. Mattis aliquam faucibus purus in massa tempor nec feugiat. Quam pellentesque nec nam aliquam. Eu facilisis sed odio morbi quis. Ut enim blandit volutpat maecenas volutpat blandit. Sit amet nisl purus in mollis nunc sed. Neque egestas congue quisque egestas diam. Ut etiam sit amet nisl. Sodales neque sodales ut etiam sit amet. Augue neque gravida in fermentum et. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Blandit cursus risus at ultrices mi tempus imperdiet nulla. Ipsum dolor sit amet consectetur. Lectus urna duis convallis convallis tellus id interdum velit."
    }, 
    {
      name:"Yosemite Park",
      image: "https://source.unsplash.com/i9FLJwYhVQs",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna condimentum mattis. Mattis aliquam faucibus purus in massa tempor nec feugiat. Quam pellentesque nec nam aliquam. Eu facilisis sed odio morbi quis. Ut enim blandit volutpat maecenas volutpat blandit. Sit amet nisl purus in mollis nunc sed. Neque egestas congue quisque egestas diam. Ut etiam sit amet nisl. Sodales neque sodales ut etiam sit amet. Augue neque gravida in fermentum et. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Blandit cursus risus at ultrices mi tempus imperdiet nulla. Ipsum dolor sit amet consectetur. Lectus urna duis convallis convallis tellus id interdum velit."
    }, 
    {
      name:"Beach Paradise",
      image: "https://source.unsplash.com/g8fqQiwaymM",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna condimentum mattis. Mattis aliquam faucibus purus in massa tempor nec feugiat. Quam pellentesque nec nam aliquam. Eu facilisis sed odio morbi quis. Ut enim blandit volutpat maecenas volutpat blandit. Sit amet nisl purus in mollis nunc sed. Neque egestas congue quisque egestas diam. Ut etiam sit amet nisl. Sodales neque sodales ut etiam sit amet. Augue neque gravida in fermentum et. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Blandit cursus risus at ultrices mi tempus imperdiet nulla. Ipsum dolor sit amet consectetur. Lectus urna duis convallis convallis tellus id interdum velit."
    }, 
]

function seedDB() {
  console.log("seedDB called");
  Campground.remove({}, function(err) {
    if(err) {
      console.log(err);
    }
    console.log("removed campgrounds");
    data.forEach(function(seed) {
      Campground.create(seed, function(err, campground) {
        if(err) {
          console.log(err);
        } else {
          console.log("added a campground");
          Comment.create(
              {
                text: "This place is great, but I wish it had internet",
                author: "Homer"
              }, function(err, comment) {
                if(err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log("Created a new comment");
                }
              }
            )
        }
      });
    });
  });
}


module.exports = seedDB;
