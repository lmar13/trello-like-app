var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

console.log('inializing Schema');
var boardSchema = mongoose.Schema({
    title: String,
    owner: String,
    startDate: Date,
    endDate: Date,
    assignedUsers: [String]
});

console.log('exporting Schema');
module.exports = mongoose.model('Board', boardSchema);
console.log('exported Schema');
