const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getOneImage = image_id => {
    const q = `
        SELECT * FROM images
        WHERE id = ($1);
    `;

    return db.query(q, [image_id]);
};

exports.selectComments = image_id => {
    const q = `
        SELECT comment, username FROM comments
        WHERE image_id = ($1);
    `;

    return db.query(q, [image_id]);
};

exports.insertComments = (image_id, comment, username) => {
    const q = `
    INSERT INTO comments (image_id, comment, username)
    VALUES ($1, $2, $3)
    RETURNING comment, username
    `;
    return db.query(q, [image_id, comment, username]);
};
exports.getImages = () => {
    const q = `
        SELECT * FROM images
        ORDER BY id DESC
        LIMIT 6;
    `;

    return db.query(q);
};

exports.writeFileTo = (url, title, description, username) => {
    const q = `
    INSERT INTO images(url, title, description, username)
    VALUES ($1, $2, $3, $4)
    RETURNING url, title`;
    return db.query(q, [
        url || null,
        title || null,
        description || null,
        username || null
    ]);
};

exports.getMoreImages = lastImageId => {
    const q = `
    SELECT * FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 6;
    `;
    return db.query(q, [lastImageId]);
};
