const { conn } = require('../DBs/db');

const userService = require('./userService');

async function getMyComments(userId, artId) {
    try {
        const data = (await conn.query(`SELECT * FROM comments WHERE art_id='${artId}' AND comment_by='${userId}' ORDER BY commented_on DESC;`)).rows;
        var comments = [];
        for (let i = 0; i < data.length; i++) {
            comments.push(data[i]);
        }
        const ratingsData = (await conn.query(`SELECT * FROM likes_ratings WHERE art_id='${artId}' AND user_id='${userId}';`)).rows[0];


        return {
            msg: "Comments Found",
            comments: comments,
            likeStatus: ratingsData ? ratingsData.like_status : false,
            ratings: ratingsData ? ratingsData.ratings : 0
        };

    } catch (e) {
        console.log(e)
        return { error: e }
    }
}

async function getArrangedComments(artId, userId = null) {
    try {
        if (!userId) {
            const data = await conn.query(`SELECT * FROM comments WHERE art_id='${artId}' ORDER BY commented_on DESC;`);

            const reactions = await getTotalReactionCount(artId);
            const commentData = await appendUserDetailsToComments(data.rows)
            return {
                msg: "Comments Found",
                comments: commentData,
                commentsCount: reactions.commentCount,
                likesCount: reactions.likesCount,
                ratings: reactions.ratings,
                likeStatus: false,
                myRatings: 0
            };
        } else {

            const myCommentData = await getMyComments(userId, artId);
            const remainingData = (await conn.query(`SELECT * FROM comments WHERE art_id='${artId}' AND comment_by!='${userId}' ORDER BY commented_on DESC;`)).rows;

            for (let i = 0; i < remainingData.length; i++) {
                myCommentData.comments.push(remainingData[i]);
            }

            const ratingsData = (await getTotalReactionCount(artId));
            const commentData = await appendUserDetailsToComments(myCommentData.comments)
            return {
                msg: "Comments Found",
                comments: myCommentData ? commentData : null,
                likesCount: ratingsData ? ratingsData.likesCount : 0,
                ratings: ratingsData ? ratingsData.ratings : 0,
                commentsCount: ratingsData ? ratingsData.commentCount : 0,
                likeStatus: myCommentData ? myCommentData.likeStatus : false,
                myRatings: myCommentData ? myCommentData.ratings : 0
            };

        }
    } catch (e) {
        console.log(e)
        return { error: e }
    }
}
async function appendUserDetailsToComments(commentArr) {
    try {
        if (commentArr) {
            for (let i = 0; i < commentArr.length; i++) {

                const userInfo = await userService.getUserDetailsService(commentArr[i].comment_by);
                commentArr[i]['commentPersonName'] = userInfo.name;
            }
        }

        return commentArr;
    } catch (e) {
        console.log(e)
        return { error: e }
    }
}
async function getTotalReactionCount(artId) {
    try {

        const data = await conn.query(`SELECT * FROM likes_ratings WHERE art_id='${artId}';`);
        const likesData = data.rows;
        var likesCount = 0;
        var ratingsArr = [];

        for (let i = 0; i < data.rowCount; i++) {
            ratingsArr.push(likesData[i].ratings);
            if (likesData[i].like_status) {
                likesCount++
            }
        }
        const ratings = ratingsArr.reduce((a, b) => a + b, 0) / ratingsArr.length;
        const comments = await conn.query(`SELECT * FROM comments WHERE art_id='${artId}'  ORDER BY commented_on DESC;`);
        return {
            msg: "Data Calculated",
            artId: artId,
            likesCount: likesCount,
            ratings: ratings ? ratings : 0,
            commentCount: comments.rowCount
        };

    } catch (e) {
        console.log(e)
        return { error: e }
    }
}


async function handleLike(user, body) {
    try {

        const alreadyLiked = (await conn.query(`SELECT * FROM likes_ratings WHERE user_id='${user.id}' AND art_id='${body.artId}'`)).rows;
        var likeStatus = true;

        if (!alreadyLiked.length) {
            const insertColumns = `art_id, user_id, like_status, date`;
            const insertValues = `'${body.artId}', '${user.id}', true, '${new Date(Date.now())}'`
            await conn.query(`INSERT INTO likes_ratings (${insertColumns}) VALUES (${insertValues});`);
        } else {
            likeStatus = alreadyLiked[0].like_status ? false : true;

            const updateData = await conn.query(`UPDATE likes_ratings SET like_status=${likeStatus} WHERE art_id='${body.artId}' AND user_id='${user.id}';  `);
        }


        return { msg: "Done", status: likeStatus };

    } catch (e) {
        return { error: e }
    }
}

async function handleRatings(user, body) {
    try {

        const alreadyLikedOrRated = (await conn.query(`SELECT * FROM likes_ratings WHERE user_id='${user.id}' AND art_id='${body.artId}'`)).rows;

        if (!alreadyLikedOrRated.length) {
            const insertColumns = `art_id, user_id, ratings, date`;
            const insertValues = `'${body.artId}', '${user.id}', ${body.rating}, '${new Date(Date.now())}'`
            await conn.query(`INSERT INTO likes_ratings (${insertColumns}) VALUES (${insertValues});`);
        } else {

            const updateData = await conn.query(`UPDATE likes_ratings SET ratings=${body.rating} WHERE art_id='${body.artId}';  `);
        }


        return { msg: "Art Work Rated", status: true };

    } catch (e) {
        console.log(e)
        return { error: e }
    }
}

async function handleComment(user, body) {
    try {

        const insertColumns = `art_id, comment, comment_by, commented_on`;
        const insertValues = `'${body.artId}', '${body.comment}', '${user.id}', '${new Date(Date.now())}'`
        await conn.query(`INSERT INTO comments (${insertColumns}) VALUES (${insertValues});`);

        return { msg: "Comment Made", status: true };

    } catch (e) {
        console.log(e)
        return { error: e }
    }
}

module.exports = {
    handleLike,
    handleRatings,
    handleComment,
    getArrangedComments
}