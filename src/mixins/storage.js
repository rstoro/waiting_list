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
      const filePath = `logs/${this.getDate(d)}/actions.log`;
      const data = JSON.stringify(
        { 'action': action, 'time': d.toTimeString(), ...params }
      ) + '\n';
      this.appendFile(filePath, data);
    },
    getLog(path) {
      const relPath = `logs/${path}/actions.log`;
      const files = this.loadFile(relPath);
      return files !== null 
        ? files.split(/\r?\n/).filter(u => u !== '').map(JSON.parse) 
        : null;
    },
    saveGroup(group) {
      // NOTE: group should be stored durring the day they were made
      const d = new Date(group.epoch);
      const filePath = `logs/${this.getDate(d)}/${group.id}.json`;
      const data = JSON.stringify(group);
      this.appendFile(filePath, data);
    },
    loadGroups(path) {
      const relPath = `logs/${path}/`;
      const filenames = this.listDir(relPath) || [];
      return filenames
          .filter(filename => !filename.includes('.log'))
          .map(filename => this.loadFile(relPath + filename))
          .map(JSON.parse);
    },
    getDate(d) {
      const newD = new Date(d.getTime() - (d.getTimezoneOffset()*60*1000));
      return newD.toISOString().split('T')[0].replace(/-/g, '/');
    }
  }
}
