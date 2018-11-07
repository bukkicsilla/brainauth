var mongoose = require('mongoose');

var functionalitySchema = new mongoose.Schema({
    functionality: {type: String}
});

var partSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true},
    meaning: {type: String},
    partemail: {type: String, required: true},
    functionalities: [functionalitySchema]
});

mongoose.model('Brainpart', partSchema);

/*db.brainparts.save({
    name: "Cerebrum",
    meaning: "brain"
})*/

/*db.brainparts.update({
    name: 'Cerebrum'
}, {
    $push: {
        functionalities: {
            $each: [{
                functionality: 'Reasoning'
            },
               {
               functionality: 'Recognition'
               },
               {
               functionality: 'Visual Processing'
               },
               {
               functionality: 'Speech'
               }
            ]
        }
    }
})*/


//mLab
/*{
    "name" : "Cerebrum",
    "meaning" : "brain",
    "functionalities": [
        {
            "functionality": "Reasoning"
        },
        {
            "functionality": "Recognition"
        },
        {
            "functionality": "Visual Processing"
        },
        {
            "functionality": "Speech"
        }
    ]
}*/