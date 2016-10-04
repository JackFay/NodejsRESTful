import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();
    var fs = require("fs");
	// mount the facets resource
	api.use('/facets', facets({ config, db }));


	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});
    
    api.get('/Teams', function (req, res) {
       fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
          console.log( data );
          res.end( data );
        });
    });
    
    api.post('/Teams', function(req, res){
        fs.readFile( __dirname + "/" + "users.json", 'utf8', 
        function (err, data){
            data = JSON.parse(data);
            data.push(req.body);
            console.log(req.body);
            var file = JSON.stringify(data);
            fs.writeFile( __dirname + "/" + "users.json", file, (err) => {
                if(err) throw err;
            });
            res.end(JSON.stringify(data));
        })
    });
    
    api.delete('/Teams', (req, res) => {
        fs.writeFile( __dirname + "/" + "users.json", "[]", (err) => {
            if(err) throw err;
        });
        res.end("[]");
    });
    
    api.put('/Teams', (req, res) => {
        fs.readFile( __dirname + "/" + "users.json", 'utf8', 
        function (err, data){
            data = JSON.parse(data);
            var index = data.findIndex(x => x.Name == req.body.Name);
            data[index].City = req.body.City;
            data[index].stadium = req.body.Stadium;
            var file = JSON.stringify(data);
            fs.writeFile( __dirname + "/" + "users.json", file, (err) => {
                if(err) throw err;
            });
            res.end(JSON.stringify(data));
        })
    });
    
    api.get('/Teams/:team', (req, res) => {
        fs.readFile( __dirname + "/" + "users.json", 'utf8', 
        function (err, data){
            data = JSON.parse(data);
            var index = data.findIndex(x => x.Name == req.params.team);
            res.end(JSON.stringify(data[index]));
        });
    });
    
    api.get('/Teams/:team/Players', (req, res) => {
        fs.readFile( __dirname + "/" + "users.json", 'utf8', 
        function (err, data){
            data = JSON.parse(data);
            var index = data.findIndex(x => x.Name == req.params.team);
            res.end(JSON.stringify(data[index].Players));
        });
    });
    
    api.get('/Teams/:team/Stadium', (req, res) => {
        fs.readFile( __dirname + "/" + "users.json", 'utf8', 
        function (err, data){
            data = JSON.parse(data);
            var index = data.findIndex(x => x.Name == req.params.team);
            res.end(JSON.stringify(data[index].stadium));
        });
    });
    
    api.post('/Teams/:team/Players', (req, res) => {
        fs.readFile( __dirname + "/" + "users.json", 'utf8', 
        function (err, data){
            data = JSON.parse(data);
            var index = data.findIndex(x => x.Name == req.params.team);
            if(data[index].hasOwnProperty("Players")){
                data[index].Players.push(req.body);
            }else{
                data[index]["Players"] = [req.body];
            }
            
            var file = JSON.stringify(data);
            fs.writeFile( __dirname + "/" + "users.json", file, (err) => {
                if(err) throw err;
            });
            res.end(JSON.stringify(data));
            
        });
    });

	return api;
}
