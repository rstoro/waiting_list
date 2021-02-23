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
    log(action, params) {
      const d = new Date();
      const filePath = `logs/${this.getDate(d)}.log`;
      const data = JSON.stringify(
        { 'action': action, 'time': d.toTimeString(), ...params }
      ) + '\n';
      this.appendFile(filePath, data);
    },
    getLog(path) {
      const relPath = `logs/${path}.log`;
      const files = this.loadFile(relPath);
      return files !== null 
        ? files.split(/\r?\n/).filter(u => u !== '').map(JSON.parse) 
        : null;
    },
    getLogs(sPath, ePath) {
      // NOTE: these are expected to be date like paths (i.e. 2021/10/23)
      const sDate = new Date(sPath);
      const eDate = new Date(ePath);
      const dates = [];
      for (const dt = new Date(sDate); dt <= eDate; dt.setDate(dt.getDate()+1)) {
        dates.push(this.getDate(dt));
      }

      const logs = [];
      dates.forEach(date => {
        const curLog = this.getLog(date);
        if (curLog !== null) {
          logs.push(curLog);
        }
      });

      return logs;
    },
    getDate(d) {
      const newD = new Date(d.getTime() - (d.getTimezoneOffset()*60*1000));
      return newD.toISOString().split('T')[0].replace(/-/g, '/');
    }
  }
}
