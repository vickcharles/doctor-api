const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
  userId: {
		type: Schema.ObjectId,
		ref: "User"
	},
  bio: String,
  education: {
    schoolName: String,
		graduationYear: String,
		degreeType: String,
		fieldOfStudy: String,
		description: String,
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema)
