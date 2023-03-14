const { pool } = require("../configs/database");
const avoidUndefined = require("../utils/handleUndefinedValue");

const articleModel = {};

articleModel.getArticles = async () => {
  const query = "SELECT * FROM articles WHERE isEnabled = true";
  try {
    const [rows, fields] = await pool.query(query)
    return rows
  } catch (err) {
    throw err
  }
};

articleModel.addArticle = async (article, transaction) => {
  const query = "INSERT INTO articles (title, link, menu_id, content, description, isEnabled, tag) VALUE(?,?,?,?,?,?,?)";
  try {
    article.isEnabled = true;
    const params = [article.title, article.link, article.menu_id, article.content, article.description, article.isEnabled, article.tag]
    avoidUndefined(params)
    const [rows, fields] = await transaction.execute(query, params)
    return rows.insertId
  } catch (err) {
    throw err
  }
};

articleModel.updateArticleById = async (article, transaction) => {
  const query = "UPDATE articles SET title =?, link =?,menu_id =?, content =?, description=?, isEnabled =?, tag =?   WHERE id = ?";
  try {
    const params = [article.title, article.link, article.menu_id, article.content, article.description, article.isEnabled, article.tag, article.id]
    avoidUndefined(params)
    const result = await transaction.execute(query, params)
    return result[0].affectedRows > 0;
  } catch (err) {
    throw err
  }
};

articleModel.getArticleByLink = async (link) => {
  const query = "SELECT * FROM articles WHERE isEnabled = true AND link = ?";
  try {
    const [rows, fields] = await pool.execute(query, [link])
    return rows[0]
  } catch (err) {
    throw err
  }
};
articleModel.getArticleById = async (id) => {
  const query = "SELECT * FROM articles WHERE isEnabled = true AND id = ?";
  try {
    const [rows, fields] = await pool.execute(query, [id])
    return rows[0]
  } catch (err) {
    throw err
  }
};

module.exports = articleModel;
