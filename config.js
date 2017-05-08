exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://dev:knowchi1@ds133281.mlab.com:33281/autos-capstone';
exports.PORT = process.env.PORT || 8080;
