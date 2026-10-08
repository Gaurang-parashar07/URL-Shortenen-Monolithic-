
const urlService = require("../services/url.service");


exports.shortenUrl = async (req, res, next) => {
    try {
        const result = await 
        urlService.createShortUrl(req.body.originalUrl);
        res.json(result);
    } catch (error) {
        next(error);
    }
}


exports.redirectUrl = async (req, res, next) => {
    try {
        const original = await urlService.getOriginalUrl(req.params.code);
        res.redirect(original);
    } catch (error) {
        next(error);
    }
};