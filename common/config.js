const mongoDB = {
    username: 'root',
    password: 'wly15010414184',
    server: 'www.shendeng520.com:27017',
    tableName: 'film',
    srv: false
};

module.exports = {
    mongoURI: `mongodb${mongoDB.srv ? '+srv' : ''}://${mongoDB.username}:${mongoDB.password}@${mongoDB.server}/${mongoDB.tableName}?authSource=admin`,
    Key: '9vApxLk50825knhm',
    iv: 'FnJL7EDz1248qsaz' //必须16位
};