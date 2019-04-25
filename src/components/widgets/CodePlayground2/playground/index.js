const ReactQuerystringRouter = require('react-querystring-router');
const ComponentPlayground = require('react-component-playground');
const getComponentFixtureTree = require('./get-component-fixture-tree.js');

const getTitleForFixture = function(params) {
  let title = 'React Component Playground';

  // Set document title to the name of the selected fixture
  if (params.component && params.fixture) {
    title = `${params.component}:${params.fixture} – ${title}`;
  }

  return title;
};

module.exports = new ReactQuerystringRouter.Router({
  container: document.getElementById('root'),

  defaultProps: {
    components: getComponentFixtureTree(),
  },

  getComponentClass() {
    return ComponentPlayground;
  },

  onChange(params) {
    document.title = getTitleForFixture(params);
  },
});
