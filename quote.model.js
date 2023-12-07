var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuoteSchema = new Schema(
    {
      quote  : String,
      author : String,
    },
    { versionKey: false, collection: 'quotes'  }
);

module.exports = mongoose.model("Quote", QuoteSchema);