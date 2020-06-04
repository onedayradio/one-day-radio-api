module.exports = {
  url: 'mongodb://onedayradio-admin:password@localhost:27017/onedayradio?authSource=admin',
  databaseName: 'onedayradio',
  options: {
    useNewUrlParser: true, // removes a deprecation warning when connecting
    useUnifiedTopology: true, // removes a deprecating warning when connecting
  },
}
