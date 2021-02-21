import fs from 'fs';
const baseDir = './data/';

export default {
  methods: {
    loadFile(filePath) {
      const fullPath = baseDir + filePath;
      if (!fs.existsSync(fullPath)) {
        this.saveFile(filePath, JSON.stringify([]));
      }

      return fs.readFileSync(fullPath);
    },
    saveFile(filePath, data) {
      const fullPath = baseDir + filePath;
      const fileDir = fullPath.split('/').slice(0, -1).join('/');
      this.mkdirSafe(fileDir);
      fs.writeFileSync(fullPath, data);
    },
    log(action, id) {
      const d = new Date();
      const filePath = `logs/${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()}.log`;
      const data = `${id},${action},${d.toTimeString()}\n`;
      this.saveFile(filePath, data)
    },
    mkdirSafe(dir) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    },
    listDir(dirPath) {
      const fullPath = baseDir + dirPath;
      return fs.existsSync(fullPath) ? fs.readdirSync(fullPath) : []
    }
  }
}
