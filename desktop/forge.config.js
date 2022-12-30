module.exports = {
  packagerConfig: {
    asar: true,
    ignore: [
      "^\\/public$",
      "^\\/node_modules$",
      "^\\/[.].+",
      // [...]
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'LemonLab',
        authors: 'Eduardo Torres',
        description: 'A simple description'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
