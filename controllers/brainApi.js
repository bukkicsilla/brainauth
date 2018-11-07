var mongoose = require('mongoose');
var Brain = mongoose.model('Brainpart');

module.exports.allParts = function(req, res){
    Brain.find({}, function(err, docs){
        if (!err){
          res.status(200);
           res.json(docs); 
         } else {throw err;}
       });
}

module.exports.showPart = function(req, res){
    if (req.params && req.params.brainpartid){
      Brain.findById(req.params.brainpartid)
         .exec(function(err, part){
          if (!part){
              res.status(404);
              res.json("id not found");
              return;
          } else if(err){
              res.status(404);
              res.json(err);
              return;
          }
          res.status(200);
          res.json(part);
      });
    } else {
        res.status(404);
        res.json("no id in request");
    }
    
}

module.exports.createPart = function(req, res){
    console.log("API user ", req.body)
    Brain.create({
        name: req.body.name,
        meaning: req.body.meaning,
        functionalities: req.body.functionalities,
        partemail: req.body.partemail
    }, function(err, part){
        if(err){
            res.status(400);
            res.json(err);
        } else {
            res.status(201);
            res.json(part);
        }
    });
}

module.exports.deletePart = function(req, res){
    var partid = req.params.brainpartid;
    if (partid){
        Brain.findByIdAndRemove(partid)
           .exec(
                function(err, part){
                    if(err){
                        res.status(404);
                        res.json(err);
                        return;
                    }
                    res.status(204);
                    res.json(null);
                });
    } else {
        res.status(404);
        res.json({"message":"no id"});
    } 
} 

module.exports.updateMeaning = function(req, res){
    if(!req.params.brainpartid){
        res.status(404);
        res.json({"message": "id not found, it is required"});    
        return;
    }
    Brain.findById(req.params.brainpartid)
       .select('-name')
       .exec(
        function(err, part){
            if(!part){
                res.status(404);
                res.json({"message":"brain part is not found"});
                return;
            } else if (err) {
                res.status(400);
                res.json(err);
                return;
            }
            if (req.body.meaning)  part.meaning = req.body.meaning;
            
            part.save(function(err, part){
                if (err){
                    res.status(404);
                    res.json(err);
                } else {
                    res.status(200);
                    res.json(part);
                }   
        });
  });
}

module.exports.updateFunctionalities = function(req, res){

    if(!req.params.brainpartid){
        res.status(404);
        res.json({"message": "id not found, it is required"});    
        return;
    }
    Brain.findById(req.params.brainpartid)
       .select('-name')
       .exec(
        function(err, part){
            if(!part){
                res.status(404);
                res.json({"message":"brain part is not found"});
                return;
            } else if (err) {
                res.status(400);
                res.json(err);
                return;
            }
            part.functionalities = [];
            part.functionalities = part.functionalities.concat(req.body.functionalities);
            
            part.save(function(err,  part){
                if (err){
                    res.status(404);
                    res.json(err);
                } else {
                    res.status(200);
                    res.json(part);
                }   
        });
  });
}
