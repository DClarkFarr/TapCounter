/**
 * Usage Example
 * npx ./create-store.js "Example Store Name" 1234
 */
const parseArgs = require("./cli.js");
const { getStoreCollection } = require("../dist/db/storeModel");

const args = parseArgs({
    args: ["name", "code"],
    options: [],
});

if (args._unknown && args._unknown.length) {
    throw new Error(
        "Missing the following arguments/options: " + args._unknown.join(", ")
    );
}

console.log("ready to go");

const createStore = async function () {
    try {
        const collection = await getStoreCollection();

        const exist = await collection.findOne({ code: args.code });

        if (exist) {
            throw new Error("Store already exists");
        }

        const result = await collection.insertOne({
            name: args.name,
            code: args.code,
            deletedAt: null,
        });

        console.log("created", result);
        process.exit();
    } catch (err) {
        console.log("error executing script", err.message);
        process.exit(1);
    }
};

const output = createStore();

console.log("output", output);
