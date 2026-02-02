import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://rahul_srivastava:YzqbLAxC0pe84fzw@cluster0.ohykh.mongodb.net/contact-karo?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  console.warn("Missing MONGODB_URI environment variable");
}

// Cache the connection across lambda invocations / module reloads
const globalAny = global;
if (!globalAny._mongo) {
  globalAny._mongo = { conn: null, promise: null };
}

async function dbConnect() {
  if (globalAny._mongo.conn) {
    return globalAny._mongo.conn;
  }

  if (!globalAny._mongo.promise) {
    // modern mongoose (v6+) doesn't accept useNewUrlParser/useUnifiedTopology options
    // keep connection simple and let mongoose use defaults
    globalAny._mongo.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  globalAny._mongo.conn = await globalAny._mongo.promise;
  return globalAny._mongo.conn;
}

export default dbConnect;


// const response = {
//     qr_id: '1234567890',
//     vehicle_no: "DL1CAB1234",
//     owner_name: "John Doe",
//     emergency_contact_1 : "9876543210",
//     emergency_contact_2 : "8765432109",
//     owner : "7654321098",
//     owner_whatsapp : "7654321098",
//     owner_email : "rajsrivastvaa@gmail.com",
//     address: "123, ABC Street, New Delhi",
//     batch_id: "BATCH001",
// }