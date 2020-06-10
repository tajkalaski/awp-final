module.exports = (suggestionsDb) => {
    let express = require('express');
    let router = express.Router();

    router.get('/api/suggestions', async (req, res) => {
        const suggestions = await suggestionsDb.getSuggestions()
        res.json(suggestions)
    });
    
    // Get single suggestion (basic)
    router.get('/api/suggestions/:id', async (req, res) => {
        let id = req.params.id
        const suggestion = await suggestionsDb.getSuggestion(id);
        res.json(suggestion);
    });
    
    // Add new suggestion (full version)
    router.post('/api/suggestions', async (req, res) => {
        let suggestion = {
            id: Math.random(),
            text: req.body.suggestionText,
            signatures: [],
        };
    
        const newSuggestion = await suggestionsDb.postSuggestion(suggestion);
        res.json(newSuggestion);
    })
    
    // Post a signature (basic)
    router.post('/api/suggestions/:id/signatures', async (req, res) => {
        let suggestionId = req.params.id;
        let signature = {
            id: Math.random(),
            text: req.body.text,
            date: new Date()
        }
        const updatedSuggestion = await suggestionsDb.postSignature(suggestionId, signature);
        res.json(updatedSuggestion);
    
    });

    return router;
}