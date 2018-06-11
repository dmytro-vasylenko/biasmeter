const { ObjectId } = require("mongodb");
const mongodb = require("./index");
const Medias = require("./Medias");

class Events {
  static get events() {
    return mongodb.database.collection("events");
  }
  static getEvents() {
    return this.events.find({}).toArray();
  }

  static getEvent(query) {
    return this.events.findOne(query);
  }

  static rate({ eventId, sourceId, user, truth, bias, text }) {
    this.getEvent({ _id: ObjectId(eventId) }).then(event => {
      const { name } = event.sources[sourceId];
      Medias.updateStatistic({ name, bias, truth });
    });

    return this.events.update(
      { _id: ObjectId(eventId) },
      {
        $addToSet: {
          [`sources.${sourceId}.comments`]: { user: user.email, truth, bias, text }
        }
      }
    );
  }

  static addSource(eventId, { name, title, url }) {
    return this.events.update(
      { _id: ObjectId(eventId) },
      {
        $push: {
          sources: {
            name,
            title,
            url,
            comments: []
          }
        }
      }
    );
  }

  static add(params) {
    return this.events.insert({
      ...params,
      sources: []
    });
  }

  static removeComment(eventId, sourceId, commentId, { email, bias, truth, text }) {
    return this.events.update(
      { _id: ObjectId(eventId) },
      {
        $unset: {
          [`sources.${sourceId}.comments.${commentId}`]: commentId
        }
      }
    );
  }
}

module.exports = Events;
