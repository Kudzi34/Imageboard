const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getImages = () => {
    const q = `
        SELECT * FROM images
        ORDER BY id DESC;
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
