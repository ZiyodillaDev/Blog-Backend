class Blogs {
  constructor(id,date, text, user_id, description) {
    this.id = id;
    this.text = text;
    this.user_id = user_id;
    this.description = description;
    this.date = date;
  }
}

module.exports = Blogs;
