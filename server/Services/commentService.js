const { conn } = require('../DBs/db');

async function getAllComments(artId) {
    try {

        const data = await conn.query(`SELECT * FROM comments WHERE art_id='${artId}' ORDER BY commented_on DESC;`);

        const reactions = await getTotalReactionCount(artId);
        return { msg: "Comments Found",
        comments: data.rows,
        commentsCount: reactions.commentCount,
        likesCount: reactions.likesCount,
        ratings: reactions.ratings};

    } catch (e) {
        console.log(e)
        return { error: e }
    }
}
async function getMyComments(userId, artId) {
    try {
        const data = (await conn.query(`SELECT * FROM comments WHERE art_id='${artId}' AND comment_by='${userId}' ORDER BY commented_on DESC;`)).rows;
        var comments = [];
        for (let i = 0; i < data.length; i++) {
            comments.push(data[i]);
        }
        const ratingsData = (await conn.query(`SELECT * FROM likes_ratings WHERE art_id='${artId}' AND user_id='${userId}';`)).rows[0];
        console.log(ratingsData);


        return {
            msg: "Comments Found",
            comments: comments,
            likeStatus: ratingsData.like_status,
            ratings: ratingsData.ratings
        };

    } catch (e) {
        console.log(e)
        return { error: e }
    }
}

async function getArrangedComments(userId, artId) {
    try {
        const myCommentData = await getMyComments(userId, artId);
        const remainingData = (await conn.query(`SELECT * FROM comments WHERE art_id='${artId}' AND comment_by!='${userId}' ORDER BY commented_on DESC;`)).rows;
        
        for (let i = 0; i < remainingData.length; i++) {
            myCommentData.comments.push(remainingData[i]);
        }

        const ratingsData = (await getTotalReactionCount(artId));
        return {
            msg: "Comments Found",
            comments: myCommentData.comments,
            likesCount: ratingsData.likesCount,
            ratings: ratingsData.ratings,
            commentsCount: ratingsData.commentCount
        };

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
            ratings: ratings,
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
        console.log(alreadyLiked);
        var likeStatus = true;

        if (!alreadyLiked.length) {
            console.log('no data');
            const insertColumns = `art_id, user_id, like_status, date`;
            const insertValues = `'${body.artId}', '${user.id}', true, '${new Date(Date.now())}'`
            await conn.query(`INSERT INTO likes_ratings (${insertColumns}) VALUES (${insertValues});`);
        } else {
            likeStatus = alreadyLiked[0].like_status ? false : true;

            console.log(likeStatus);
            console.log('data exists, updating...');
            const updateData = await conn.query(`UPDATE likes_ratings SET like_status=${likeStatus} WHERE art_id='${body.artId}';  `);
            console.log(updateData);
        }


        return { msg: "Done", status: likeStatus };

    } catch (e) {
        return { error: e }
    }
}

async function handleRatings(user, body) {
    try {

        const alreadyLikedOrRated = (await conn.query(`SELECT * FROM likes_ratings WHERE user_id='${user.id}' AND art_id='${body.artId}'`)).rows;
        console.log(alreadyLikedOrRated);

        if (!alreadyLikedOrRated.length) {
            console.log('no data');
            const insertColumns = `art_id, user_id, ratings, date`;
            const insertValues = `'${body.artId}', '${user.id}', ${body.rating}, '${new Date(Date.now())}'`
            await conn.query(`INSERT INTO likes_ratings (${insertColumns}) VALUES (${insertValues});`);
        } else {

            console.log('data exists, updating...');
            const updateData = await conn.query(`UPDATE likes_ratings SET ratings=${body.rating} WHERE art_id='${body.artId}';  `);
            console.log(updateData);
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
    getAllComments,
    getArrangedComments
}