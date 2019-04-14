var express = require('express');

//Needed for Firestore
var {Datastore} = require('@google-cloud/datastore');
const datastoreProjectId = 'minify-me-20190315';
const datastore = new Datastore({
    projectId: datastoreProjectId,
});

//Needed to handle POST requests 
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

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
        const statsKey = datastore.key(["stats", "basic_stats"]);
        // Get number of entities
        const [stats] = await datastore.get(statsKey);
        // The kind for the new entity
        const kind = 'shortenedURLS';
        // The name/ID for the new entity
        const name = makeid();
        // The Cloud Datastore key for the new entity
        const taskKey = datastore.key([kind, name]);

        const query = datastore.createQuery('shortenedURLS').filter("urlInserted", "=", req.body.urlToMinify).order('urlInserted').order('dateCreated').limit(1)
        const [exists] = await datastore.runQuery(query);
        //Check if sent empty TODO
        if (exists.length) {
            res.json({
                'id': exists[0][datastore.KEY].name,
                'url': exists[0].urlInserted,
            });
        }
        else {
             //Prepares the new entity
            const task = {
                key: taskKey,
                data: {
                    dateCreated: new Date(),
                    urlInserted: req.body.urlToMinify,
                },
            };

            stats.totalURLs++
            //Saves the entity
            await datastore.update({
                key: statsKey,
                data: stats
            });
            await datastore.save(task);
            console.log(`Sortened to ${task.key.name} from ${task.data.urlInserted}`);

            res.json({
                'id': task.key.name,
                'url': task.data.urlInserted,
            });
        }
    }
    quickStart().catch(console.error);
});

router.get('/:id', function (req, res) {
    async function getDocument() {
        const kind = 'shortenedURLS';
        const taskKey = datastore.key([kind, req.params.id]);
        
        const [entity] = await datastore.get(taskKey);
        if(entity){
            res.redirect(301, entity.urlInserted);
        }
        else {
            res.redirect(301, "http://www.minify-me.com/error");
        }
        

        // if( entity.urlInserted.startsWith("http") )
        //     res.redirect(entity.urlInserted);
        // else
        //     res.redirect("http://" + entity.urlInserted);
    }
    
    getDocument();
});

function makeid() {
    var text = "";
    var possible = "lz3R4hVHtj7K9axOvL8mp6SBYoPkrcINGueWgwU20qbyfTMd5EA1nCJQsZXiDF";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = router;