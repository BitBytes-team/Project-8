const mongoose = require("mongoose");
const async = require("async");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

mongoose.Promise = require("bluebird");
const app = express();

const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json()); // Add this line to parse JSON data in the request body
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

app.get("/test/:p1", function (request, response) {
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        response.status(500).send("Missing SchemaInfo");
        return;
      }
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    response.status(400).send("Bad param " + param);
  }
});
function hasNoUserSession(request, response){
  //return false;
  if (!getSessionUserID(request)){
    response.status(401).send();
    return true;
  }
  // if (session.user === undefined){
  //   response.status(401).send();
  //   return true;
  // }
  return false;
}

app.get("/user/list", function (request, response) {
  User.find({}, "_id first_name last_name", function (err, users) {
    if (err) {
      console.error("Error in /user/list:", err);
      response.status(500).send(JSON.stringify(err));
    } else {
      const userList = users.map((user) => ({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
      }));
      response.status(200).json(userList);
    }
  });
});

app.get("/user/:id", function (request, response) {
  const id = request.params.id;
  User.findById(id, "_id first_name last_name location description occupation", function (err, user) {
    if (err) {
      console.error("Error in /user/:id:", err);
      response.status(500).send(JSON.stringify(err));
    } else if (!user) {
      response.status(400).send("User not found");
    } else {
      response.status(200).json(user);
    }
  });
});

app.get("/photosOfUser/:id", function (request, response) {
  const id = request.params.id;
  Photo.find({
    user_id: id
  }, function (err, photos) {
    if (err !== null) {
      response.status(400).send("error");
    } else if (photos.length === 0) {
      response.status(400).send("no such user photos");
    } else {
      var functionStack = [];
      var info = JSON.parse(JSON.stringify(photos));
      for (var i = 0; i < info.length; i++) {
        delete info[i].__v;
        var comments = info[i].comments;

        comments.forEach(function (comment) {
          var uid = comment.user_id;

          functionStack.push(function (callback) {
            User.findOne({
              _id: uid
            // eslint-disable-next-line no-shadow
            }, function (err, result) {
              if (err !== null) {
                response.status(400).send("error");
              } else {
                var userInfo = JSON.parse(JSON.stringify(result));
                var user = {
                  _id: uid,
                  first_name: userInfo.first_name,
                  last_name: userInfo.last_name
                };
                comment.user = user;
              }
              callback();
            });
          });
          delete comment.user_id;
        });

      }

      // eslint-disable-next-line no-unused-vars
      async.parallel(functionStack, function (res) {
        response.status(200).send(info);
      });
    }
  });
});

// Add a new comment for a photo
app.post("/commentsOfPhoto/:photo_id", function (request, response) {
  const id = request.params.photo_id || "";
  const user_id = request.body.user_id || "";
  const commentText = request.body.comment || "";

  if (id === "" || user_id === "" || commentText === "") {
    response.status(400).send("Invalid input data");
    return;
  }

  Photo.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    {
      $push: {
        comments: {
          comment: commentText,
          date_time: new Date(),
          user_id: new mongoose.Types.ObjectId(user_id),
          _id: new mongoose.Types.ObjectId(),
        },
      },
    },
    // eslint-disable-next-line no-unused-vars
    function (err, returnValue) {
      if (err) {
        console.error("Error in /commentsOfPhoto/:photo_id", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      response.end();
    }
  );
});

// Get comments of a photo
app.get("/commentsOfPhoto/:photo_id", function (request, response) {
  const id = request.params.photo_id || "";

  if (id === "") {
    response.status(400).send("Invalid input data");
    return;
  }

  Photo.findById(id, { comments: 1 }, function (err, photo) {
    if (err) {
      console.error("Error in /commentsOfPhoto/:photo_id", err);
      response.status(500).send(JSON.stringify(err));
      return;
    }

    if (!photo) {
      response.status(400).send("Photo not found");
      return;
    }

    response.status(200).json(photo.comments);
  });
});
/**
 * URL /photos/new - adds a new photo for the current user
 */
app.post("/photos/new", function (request, response) {
  if (hasNoUserSession(request, response)) return;
  const user_id = getSessionUserID(request) || "";
  if (user_id === "") {
    console.error("Error in /photos/new", user_id);
    response.status(400).send("user_id required");
    return;
  }
  processFormBody(request, response, function (err) {
    if (err || !request.file) {
      console.error("Error in /photos/new", err);
      response.status(400).send("photo required");
      return;
    }
    const timestamp = new Date().valueOf();
    const filename = 'U' +  String(timestamp) + request.file.originalname;
    fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
      if (err) {
        console.error("Error in /photos/new", err);
        response.status(400).send("error writing photo");
        return;
      }
      Photo.create(
          {
            _id: new mongoose.Types.ObjectId(),
            file_name: filename,
            date_time: new Date(),
            user_id: new mongoose.Types.ObjectId(user_id),
            comment: []
          })
          .then((returnValue) => {
            response.end();
          })
          .catch(err => {
            console.error("Error in /photos/new", err);
            response.status(500).send(JSON.stringify(err));
          });
    });
  });
});

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log("Listening at http://localhost:" + port + " exporting the directory " + __dirname);
});
