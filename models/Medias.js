const mongodb = require("./index");

class Media {
  static get medias() {
    return mongodb.database.collection("medias");
  }

  static getMedia(name) {
    return this.medias.findOne({ name });
  }

  static async getAll() {
    const medias = await this.medias.find({}).toArray();
    medias.forEach(media => {
      media.truth = media.totalTruth / media.truthCounter || 0;
      media.bias = media.totalBias / media.biasCounter || 0;
    });

    return medias;
  }

  static async updateStatistic({ name, bias, truth }) {
    this.medias.update(
      { name },
      {
        $inc: {
          totalBias: parseInt(bias),
          totalTruth: parseInt(truth),
          truthCounter: 1,
          biasCounter: 1
        }
      }
    );
  }
}

module.exports = Media;
