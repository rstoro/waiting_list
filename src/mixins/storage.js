import fs from 'fs';
const basePath = './data/';

export default {
  methods: {
    loadFile(name) {
      const filePath = basePath + name + '.json';
      if (!fs.existsSync(filePath)) {
        this.saveFile(name, {});
        console.log('file created');
      }
      
      return JSON.parse(fs.readFileSync(filePath));
    },
    saveFile(name, data) {
      const filePath = basePath + name + '.json';
      fs.writeFileSync(filePath, JSON.stringify(data));
    }
  }
}
