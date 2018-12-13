const petSchema = new SimpleSchema({
  name: { type: String, min: 1, max: 200, optional: true },
  age: { type: Number, min: 0 },
  contactNUmber: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Phone
  }
});

petSchema.validate({
  age: 21,
  contactNUmber: "1234"
});
WebApp.connectHandlers.use((req, res, next) => {
  const _id = req.url.slice(1);
  const link = Links.findOne({ _id });
  if (link) {
    res.statusCode = 302;
    res.setHeader("Location", link.url);
    res.end();
  } else {
    next();
  }
});
