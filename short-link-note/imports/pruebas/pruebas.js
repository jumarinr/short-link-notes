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
