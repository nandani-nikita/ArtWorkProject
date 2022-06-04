const { verifyToken } = require('../Controllers/jwt');
const utility = require('./utility');

const commentService = require('../Services/commentService');

const like = async (req, res) => {
    try {
        const validUser = await verifyToken(req.headers['authorization']);
        if (!(validUser || validUser.id)) {
            return res.status(406).json({ error: "Unauthorized User" });
        }
        const checkValidArtWorkId = utility.isValidUuid(req.body.artId);
        if (!checkValidArtWorkId) {
            return res.status(406).json({ error: "Invalid Art Id" });
        }

        const handleLike = await commentService.handleLike(validUser, req.body);
        if ('error' in handleLike) {
            return res.status(406).json({ error: handleLike.error.toString() });
        }
        return res.status(200).json({
            msg: handleLike.msg,
            status: handleLike.status
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(406).json({ error: error });
    }
};
const rate = async (req, res) => {
    try {
        const validUser = await verifyToken(req.headers['authorization']);
        if (!(validUser || validUser.id)) {
            return res.status(406).json({ error: "Unauthorized User" });
        }
        const checkValidArtWorkId = utility.isValidUuid(req.body.artId);
        if (!checkValidArtWorkId) {
            return res.status(406).json({ error: "Invalid Art Id" });
        }

        const checkValidRates = utility.isValidRates(req.body.rating);
        if (!checkValidRates) {
            return res.status(406).json({ error: "Ratings must be between 1-5 and of integer type" });
        }
        const handleRatings = await commentService.handleRatings(validUser, req.body);
        console.log(handleRatings.error);
        if ('error' in handleRatings) {
            return res.status(406).json({ error: handleRatings.error.toString() });
        }
        return res.status(200).json({
            msg: handleRatings.msg,
            status: handleRatings.status
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(406).json({ error: error });
    }
};


const comment = async (req, res) => {
    try {
        const validUser = await verifyToken(req.headers['authorization']);
        if (!(validUser || validUser.id)) {
            return res.status(406).json({ error: "Unauthorized User" });
        }
        const checkValidArtWorkId = utility.isValidUuid(req.body.artId);
        if (!checkValidArtWorkId) {
            return res.status(406).json({ error: "Invalid Art Id" });
        }

        const checkValidCommentText = utility.isValidTextContent(req.body.comment);
        if (!checkValidCommentText) {
            return res.status(406).json({ error: "Invalid Comment String. Allowed Characters: a-zA-Z0-9 _@.!#&()" });
        }
        const handleComment = await commentService.handleComment(validUser, req.body);
        console.log(handleComment.error);
        if ('error' in handleComment) {
            return res.status(406).json({ error: handleComment.error.toString() });
        }
        return res.status(200).json({
            msg: handleComment.msg,
            status: handleComment.status
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(406).json({ error: error });
    }
};

const getAllComments = async (req, res) => {
    try {
        const checkValidArtWorkId = utility.isValidUuid(req.body.artId);
        if (!checkValidArtWorkId) {
            return res.status(406).json({ error: "Invalid Art Id" });
        }
        var data;
        const validUser = await verifyToken(req.headers['authorization']);
        if (!(validUser || validUser.id)) {
            data = await commentService.getAllComments(req.body.artId);
        } else {
            data = await commentService.getArrangedComments(validUser.id, req.body.artId);
        }
        console.log(data.error);
        if ('error' in data) {
            return res.status(406).json({ error: data.error.toString() });
        }
        return res.status(200).json({
            msg: data.msg,
            comments: data.comments,
            commentsCount: data.commentsCount,
        likesCount: data.likesCount,
        ratings: data.ratings
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(406).json({ error: error });
    }
};



module.exports = {
    like,
    rate,
    comment,
    getAllComments,
}
