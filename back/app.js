require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")

const morgan = require("morgan");
const app = express();
const { Product } = require("./model/product.js")
const { User } = require("./model/user.js")
const { Order } = require("./model/order.js")
const cors = require("cors");
app.use(cors())
app.use(morgan(':date[iso] :method :url :status :response-time ms'));
app.use(express.json());

app.use("/products", require("./routes/product.js"));
app.use("/users/login", require("./routes/auth.js"));
app.use("/users", require("./routes/user.js"));
app.use("/order", require("./routes/order.js"));
/*app.use("/", require("./routes/"));*/
const PORT = process.env.PORT ?? 3000;
console.log(process.env.MONGO_URI_DEV);


mongoose.connect(process.env.MONGO_URI_DEV)
    .then(async () => {
        console.log("connect to db");

        app.listen(PORT, () => console.log(`listen in port ${PORT}`));
    })

    .catch((err) => console.log("could not DB", err)
    );


