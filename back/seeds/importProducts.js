const mongoose = require("mongoose");
const XLSX = require("xlsx");
const { Product, productValidation } = require("../model/product");
require("dotenv").config();
const path = require("path");

async function importProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI_DEV);
        const workbook = XLSX.readFile(path.join(__dirname, "products.xlsx"));
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet).filter(row => Object.keys(row).length > 0)
        const validProducts = [];

        for (const row of rows) {

            row.price = Number(row.price) || 0;
            row.isUpgrade = row.isUpgrade === "true";

            const { error, value } = productValidation.validate(row);
            if (error) {
                console.log("Validation error:", error.details[0].message, "for row:", row);
                continue;
            }

            validProducts.push(value);
        }

        if (validProducts.length === 0) {
            console.log("No valid products to import.");
            process.exit();
        }

        await Product.insertMany(validProducts);
        console.log("Products imported successfully!");

        process.exit();
    } catch (err) {
        console.error("Error importing products:", err);
        process.exit(1);
    }
}

importProducts();