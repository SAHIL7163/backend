const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
            //, {
            //useUnifiedTopology: true,
<<<<<<< HEAD
           // useNewUrlParser: true
      //  });
        
=======
            //useNewUrlParser: true
        //});
>>>>>>> bed9962d1b21e0f7858dcc1f4b7f87014c0fdb6d
    } catch (err){
       console.error(err);
    }
}
module.exports = connectDB
