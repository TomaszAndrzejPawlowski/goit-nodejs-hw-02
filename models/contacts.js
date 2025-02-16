const {
  newContactAuthSchema,
  editContactAuthSchema,
  editFavContactAuthSchema,
  paginationAuthSchema,
  contactIsFavoriteAuthSchema,
} = require("../service/validation/contactValidation");
const Contact = require("../service/schemas/contact");

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (err) {
    console.log(err.message);
  }
};

const getContactById = async (contactId) => {
  try {
    return await Contact.findOne({ _id: contactId });
  } catch (err) {
    console.log(err.message);
  }
};

const removeContact = async (contactId) => {
  try {
    return await Contact.deleteOne({
      _id: contactId,
    });
  } catch (err) {
    console.log(err.message);
  }
};

const addContact = async (body) => {
  try {
    await newContactAuthSchema.validateAsync(body);
    body.email = body.email.toLowerCase();
    return await Contact.create(body);
  } catch (err) {
    if (err.isJoi) {
      err.status = 400;
      return err;
    }
    console.log(err.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone, favorite } = body;
    if (!name && !email && !phone && !favorite) {
      const result = 400;
      return result;
    } else {
      await editContactAuthSchema.validateAsync(body);
      if (body.email) body.email = body.email.toLowerCase();
      return Contact.findOneAndUpdate(
        { _id: contactId },
        { $set: body },
        { new: true }
      );
    }
  } catch (err) {
    if (err.isJoi) {
      err.status = 400;
      return err;
    }
    console.log(err.message);
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    if (!body.favorite) {
      const result = 400;
      return result;
    } else {
      await editFavContactAuthSchema.validateAsync(body);
      return Contact.findOneAndUpdate(
        { _id: contactId },
        { $set: body },
        { new: true }
      );
    }
  } catch (err) {
    if (err.isJoi) {
      err.status = 400;
      return err;
    }
    console.log(err.message);
  }
};

const getPageOfContacts = async (pagination) => {
  try {
    await paginationAuthSchema.validateAsync(pagination);
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find().limit(limit).skip(skip);
    const totalContacts = await Contact.countDocuments();
    const previousPage = page - 1;
    const pagesLeft = Math.ceil((totalContacts - skip) / limit) - 1;
    const response = {
      contacts,
      previousPage,
      pagesLeft,
      totalContacts,
    };
    return response;
  } catch (err) {
    if (err.isJoi) {
      err.status = 400;
      return err.message;
    }
    console.log(err.message);
  }
};

const getContactByFavorite = async (favorite) => {
  try {
    await contactIsFavoriteAuthSchema.validateAsync({ favorite });
    const contacts = await Contact.find({ favorite });
    return contacts;
  } catch (err) {
    if (err.isJoi) {
      err.status = 400;
      return err;
    }
    console.log(err.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  getPageOfContacts,
  getContactByFavorite,
};
