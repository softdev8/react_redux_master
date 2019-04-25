const DefaultLoaders = {
  babel: {
    title: 'React',
    config: {
      es2015: true,
      react: true,
    },
    enabled: true,
  },
  css: {
    title: 'CSS (.css, .less, .scss)',
    config: {
      css: true,
      less: false,
      sass: false,
    },
    enabled: true,
  },
};

export default DefaultLoaders;
