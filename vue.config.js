module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        files: [ 
          '**/*',
          '!**/*.example'
        ]
        // extraResources: [
        //   {
        //     'from': 'public/customResources',
        //     'to': 'customResources',
        //     'filter': ['**/*']
        //   }
        // ]
      }
    }
  }
}

