import fs from 'fs';
const basePath = './data/';

export default {
  methods: {
    loadFile(fileName) {
      const filePath = basePath + fileName;
      if (!fs.existsSync(filePath)) {
        this.saveFile(fileName, JSON.stringify([]));
      }

      return fs.readFileSync(filePath);
    },
    saveFile(fileName, data) {
      const filePath = basePath + fileName;
      fs.writeFileSync(filePath, data);
    },
    log(action, id) {
      const d = new Date();
      const fileName = `./logs/${d.getUTCFullYear()}${d.getUTCMonth() + 1}${d.getUTCDate()}.log`;
      const filePath = basePath + fileName;
      const data = `${id},${action},${d.toTimeString()}\n`;
      fs.appendFileSync(filePath, data)
    }
  }
}
