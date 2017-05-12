Autos.com
=============

Autos.com seeks to create an unbiased, and clean approach to listing vehicles. Users are able to view, create, edit and delete listings, all the while having a persistent data state that they can access from anywhere. When creating a new vehicle listing, users can specify a Year, Make, Model, Price and a Photo URL if they choose. If they don’t provide a URL, a default will be placed for them. 


Installation
-----------
To install all of the dev dependencies, you'll need Nodejs installed.

To install all required packages run:
```
npm install
```
Packages include:

* gulp
* browser-sync
* gulp-sass
* bcyrptjs
* body-parser
* chai
* chai-http
* dotenv
* express
* mocha
* mongoose
* passport
* passport-http
* cors


Usage
-----
To run the local server with browser-sync (live reload) run the following in your terminal:

```
gulp
```
To spin up the local server that exposes the endpoints, run the following in your terminal:

```
nodemon
```
In case your local environment doesn't automatically open in your default browser, it will exist at: 

```
http://localhost:3000/
```
