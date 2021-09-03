var fs = require('fs-extra');
var readline = require('readline');
var names = require('starwars-names');

var desc,
    keywords,
    author,
    title,
    styles = [];

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var determineMeta = function() {
    rl.question('Please input your description for the meta tag: ', (answer) => {
        desc = answer;
        rl.question('Keywords (separated by commas, as they would be in the meta tag): ', (answer) => {
            keywords = answer;
            rl.question('Author: ', (answer) => {
                author = answer;
                rl.question('What Title should be shown in browser tabs for this site? ', (answer) => {
                    title = answer;
                    selectStyles();
                })
            });
        })
    });
}

var selectStyles = function() {
    rl.question('Please write the name of css styles from the "styles" folder in this directory. Press enter after each one. To go to next step, type "next" at any time. ', function(answer) {
        if (answer == 'nxt' || answer == 'next' || answer == 'n') {
            build();
        } else {
            console.log(answer);
            fs.stat(`assets/extra/styles/${answer}`, function (err, stat) {
                if (err == null) {
                    styles.push(answer);
                    console.log('Success!');
                } else if (err.code == 'ENOENT') {
                    // file does not exist
                console.log('That file doesn\'t exist. Please try again.');
                } else {
                    console.log(`Sorry, there was an error! \r\n` + err.code);
                }
                selectStyles();
            });
        }
    });
}

var build = function() {
    var indexHTML = `
        <!doctype html>

        <html lang="en">
        <head>
            <meta charset="utf-8">

            <title>${title}</title>
            <meta name="description" content="${desc}">
            <meta name="author" content="${author}">
            <meta name="keywords" content="${keywords}">
            <meta name="viewport" content="width=device-width, initial-scale=0.75">

            <link rel="stylesheet" href="css/style.css">

        </head>

        <body>
            <script lang="script/javascript" src="libs/jquery.js"></script>
            <script lang="script/javascript" src="libs/foundation.min.js"></script>
            <script lang="script/javascript" src="js/index.js"></script>
        </body>
        </html>`


    var jsonFile = `
        {
            "name": "${title}",
            "version": "1.0.0",
            "description": "${desc}",
            "main": "gulpfile.js",
            "scripts": {
                "test": "gulp"
            },
            "keywords": [
                "${keywords}"
            ],
            "author": "${author}",
            "license": "ISC",
            "dependencies": {
                "browser-sync": "^2.24.7",
                "del": "^3.0.0",
                "gulp": "^3.9.1",
                "gulp-cache": "^1.0.1",
                "gulp-imagemin": "^3.4.0",
                "gulp-sass": "^3.1.0",
                "gulp-uglify": "^3.0.1",
                "run-sequence": "^2.2.0"
            },
            "devDependencies": {
                "gulp-autoprefixer": "^6.0.0"
            }
        }`

    var folderName = names.random().replace(/\s+/g, '-');
    console.log(`Your folder name is ${folderName}`);
    fs.mkdir(folderName, function (err) {
        if (err) console.log(err);
        fs.mkdir(folderName + '/build', function (err) {
            if (err) console.log(err);
            fs.mkdir(folderName + '/build/js', function (err) {
                if (err) console.log(err);
                fs.writeFile(`${folderName}/build/js/index.js`, 'console.log("Hello from index.js");', function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("index.js created.");
                });
            });
            fs.mkdir(folderName + '/build/libs', function (err) {
                if (err) console.log(err);
            });
            fs.mkdir(folderName + '/build/imgs', function (err) {
                if (err) console.log(err);
            });
            fs.mkdir(folderName + '/build/css', function (err) {
                if (err) console.log(err);
            });

            fs.writeFile(`${folderName}/build/index.html`, indexHTML, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("index.html created.");
            });

            fs.copySync('./assets/js/jquery.js', `./${folderName}/build/libs/jquery.js`);
            fs.copySync('./assets/js/foundation.min.js', `./${folderName}/build/libs/foundation.min.js`);

        });

        fs.writeFile(`${folderName}/package.json`, jsonFile, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("package.json created.");
        });

        fs.copySync('./assets/sass', `./${folderName}/sass`);
        if (styles.length > 0) {
            for (var i = 0; i < styles.length; i++) {
                fs.copySync(`styles/${styles[i]}`, `./${folderName}/sass/modules/${styles[i]}`);
            }
        }   
        fs.copySync('./assets/gulpfile.js', `./${folderName}/gulpfile.js`);
        fs.copySync('./assets/node_modules', `./${folderName}/node_modules`);

    });
}

determineMeta();