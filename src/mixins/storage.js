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
    getLogFilenames() {
      const logFiles = {};
      const logDir = `${baseDir}logs/`;
      this.mkdirSafe(logDir);

      fs.readdirSync(logDir).forEach(year => {
        logFiles[year] = []
        const yearDir = `${logDir}${year}/`;

        fs.readdirSync(yearDir).forEach(month => {
          logFiles[year][month] = []
          const monthDir = `${yearDir}${month}/`;

          fs.readdirSync(monthDir).forEach(day => {
            logFiles[year][month].push(day);
          });
        });
      });

      console.log(logFiles);
    },
    mkdirSafe(dir) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }
}
