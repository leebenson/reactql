function pageError(err) {
  // eslint-disable-next-line no-console
  console.error('Dynamic page loading failed', err);
}

function loadRoute(cb) {
  return module => cb(null, module.default);
}

export default [
  {
    path: '/',
    getComponent(location, cb) {
      import('src/app')
       .then(loadRoute(cb))
       .catch(pageError);
    },
  },
];
