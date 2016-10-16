const http = require("http");
const got = require("got");
const Benchmark = require("benchmark");
const express = require("express");
const Trench = require("trench");

(() => {
	const app = new Trench();

	app.get("/", (req, res) => {
		res.end("Hello, World!");
	});

	app.listen(8001);
})();

(() => {
	const app = express();

	app.get("/", (req, res) => {
		res.end("Hello, World!");
	});

	app.listen(8002);
})();

const suite = new Benchmark.Suite();

suite.add("Trench", {
	deferred: true,
	fn(deferred) {
		got("http://localhost:8001")
			.then(response => {
				if(response.body == "Hello, World!")
					deferred.resolve();
			});
	}
})
.add("Express", {
	deferred: true,
	fn(deferred) {
		got("http://localhost:8002")
			.then(response => {
				if(response.body == "Hello, World!")
					deferred.resolve();
			});
	}
})
.on('cycle', function(event) {
	console.log(String(event.target));
})
.on('complete', function() {
	console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run();
