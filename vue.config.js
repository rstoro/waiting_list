module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        files: [ 
          '**/*',
          '!**/*.example'
        ],
        extraFiles: [
          {
            'from': 'public',
            'to': 'public',
            'filter': 'config.json.example'
          }
        ]
      }
    }
  }
}

