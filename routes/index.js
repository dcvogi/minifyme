var express = require('express');

//Needed for Firestore
var {Firestore} = require('@google-cloud/firestore');
const config = require('../config.json');
const firestoreProjectId = config.firestoreProjectId;
const firestore = new Firestore({
    projectId: firestoreProjectId,
});

//Needed to handle POST requests 
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});
const base62 = require("base62/lib/ascii");

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        page: 'Home',
        menuId: 'home',
        title: 'Minifyme'
    });
});

/* POST home page. */
router.post('/', urlencodedParser, function (req, res, next) {
    async function quickStart() {
        
        const statsDocument = firestore.doc(`stats/basic_stats`);
        // Query if url exists
        const query = firestore.collection('shortenedURLS').where("urlInserted", "=", req.body.urlToMinify).limit(1);
        const exists = await query.get();
    
        if (exists._size) {
            res.json({
                'id': exists.docs[0].id,
                'url': exists.docs[0].data().urlInserted,
            });
        }
        else {
            var stats = await statsDocument.get()
            const updatedEntities = Number(stats.data().totalURLs) + 1
            // The name/ID for the new entity
            const name = makeid(updatedEntities);
            // The Cloud Firestore key for the new entity
            const newDocument = firestore.doc(`shortenedURLS/${name}`);
            newDocument.set({
                dateCreated: new Date(),
                urlInserted: req.body.urlToMinify,
            });

            //Saves the entity
            await statsDocument.update({
                totalURLs: updatedEntities
            });

            res.json({
                'id': name,
                'url': req.body.urlToMinify,
            });
        }
    }
    quickStart().catch(console.error);
});

router.get('/:id', function (req, res) {
    async function getDocument() {
        const kind = 'shortenedURLS';
        const taskKey = firestore.key([kind, req.params.id]);
        
        const [entity] = await firestore.get(taskKey);
        if(entity){
            res.redirect(301, entity.urlInserted);
        }
        else {
            res.redirect(301, "http://www.minify-me.com/error");
        }
    }
    getDocument();
});

function makeid(entityNumber) {
    return base62.encode(entityNumber);
}

module.exports = router;