import fs from 'fs';
const baseDir = './data/';

export default {
  methods: {
    loadFile(filePath) {
      const fullPath = baseDir + filePath;
      if (!fs.existsSync(fullPath)) {
        return null;
      }

      return '' + fs.readFileSync(fullPath);
    },
    createFile(filePath) {
      this.saveFile(filePath, '');
    },
    saveFile(filePath, data) {
      const fullPath = baseDir + filePath;
      const fileDir = fullPath.split('/').slice(0, -1).join('/');
      this.mkdirSafe(fileDir);
      fs.writeFileSync(fullPath, data);
    },
    appendFile(filePath, data) {
      const fullPath = baseDir + filePath;
      const fileDir = fullPath.split('/').slice(0, -1).join('/');
      this.mkdirSafe(fileDir);
      fs.appendFileSync(fullPath, data);
    },
    listDir(dirPath) {
      const fullPath = baseDir + dirPath;
      return fs.existsSync(fullPath) ? fs.readdirSync(fullPath) : null
    },
    mkdirSafe(dir) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    },
    log(action, id) {
      const d = new Date();
      const filePath = `logs/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/log`;
      const data = `${id},${action},${d.toTimeString()}\n`;
      this.appendFile(filePath, data);
    },
    storeUser(id, data) {
      const d = new Date();
      const filePath = `logs/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${id}`;
      this.saveFile(filePath, data);
    }
  }
}
