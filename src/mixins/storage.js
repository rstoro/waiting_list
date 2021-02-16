import fs from 'fs';
const basePath = './data/';

export default {
  methods: {
    loadFile(name) {
      const filePath = basePath + name + '.json';
      if (!fs.existsSync(filePath)) {
        this.saveFile(name, []);
        console.log('file created');
      }
      
      console.log(JSON.parse(fs.readFileSync(filePath)));
      return JSON.parse(fs.readFileSync(filePath));
    },
    saveFile(name, data) {
      const filePath = basePath + name + '.json';
      fs.writeFileSync(filePath, data);
    },
    appendFile(name, newData) {
      const filePath = basePath + name + '.json';
      const data = JSON.parse(fs.readFileSync(filePath));
      data.push(newData);
      fs.appendFileSync(filePath, data);
    }
  }
}
