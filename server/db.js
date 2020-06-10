const Schema = require("mongoose").Schema;

class Db {
    /**
     * Constructors an object for accessing kittens in the database
     * @param mongoose the mongoose object used to create schema objects for the database
     */
    constructor(mongoose) {
        // This is the schema we need to store kittens in MongoDB
        const suggestionSchema = new Schema({
            text: String,
            signatures: [{ text: String, date: Date }]
        });

        // This model is used in the methods of this class to access kittens
        this.suggestionModel = mongoose.model("sugestion", suggestionSchema);

    }

    async getSuggestions() {
        try {
            return await this.suggestionModel.find({});
        } catch (error) {
            console.error("getSuggestions:", error.message);
            return {};
        }
    }

    async getSuggestion(suggestionId) {
        try {
            return await this.suggestionModel.findById(suggestionId);
        } catch (error) {
            console.error("getSuggestion:", error.message);
            return {};
        }
    }

    async postSuggestion(newSuggestion) {
        let suggestion = new this.suggestionModel(newSuggestion);
        try {
            return suggestion.save();
        } catch (error) {
            console.error("postSuggestion:", error.message);
            return {};
        }
    }

    async postSignature(suggestionId, signature) {
        const suggestion = await this.getSuggestion(suggestionId);
        suggestion.signatures.push(signature);

        try {
            return suggestion.save();
        } catch (error) {
            console.error("postSignature:", error.message);
            return {};
        }
    }

    getSignature(suggestion, signatureId) {
        try {
            return suggestion.signatures.id(signatureId);
            //return question.answers.find(answer => answer.id == answerId);
        } catch (error) {
            console.error("getSignature:", error.message);
            return {};
        }
    }

    /**
     * This method adds a bunch of test data if the database is empty.
     * @param count The amount of questions to add.
     * @returns {Promise} Resolves when everything has been saved.
     */
    async bootstrap(count = 10) {
        const signatures = [
            { text: "Twilight Sparkle", date: new Date() },
            { text: "Fluttershy", date: new Date() },
            { text: "Applejack", date: new Date() },
            { text: "Rainbow Dash", date: new Date() },
            { text: "Pinkie Pie", date: new Date() }
        ];
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function getRandomSuggestion() {
            return [
                "Banana cake with cream cheese",
                "Chocolate coconut cake",
                "Carrot and walnut cake"
            ][getRandomInt(0, 2)];
        }

        function getRandomSignatures() {
            const shuffled = signatures.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, getRandomInt(1,shuffled.length));
        }

        let suggestionLength = (await this.getSuggestions()).length;
        console.log("Suggestion collection size:", suggestionLength);

        if (suggestionLength === 0) {
            let promises = [];

            for (let i = 0; i < count; i++) {
                let suggestion = new this.suggestionModel({
                    text: getRandomSuggestion(),
                    signatures: getRandomSignatures()
                });
                promises.push(suggestion.save());
            }

            return Promise.all(promises);
        }
    }
}



// We export the object used to access the kittens in the database
module.exports = mongoose => new Db(mongoose);