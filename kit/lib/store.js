export default function storeDriver(recycle, Rx) {
  // usually you need to create a stream based on components action
  // but for simplicity sake, store is presented as a stream
  // which is dispatching string "hello" and then "world" after 500ms

  const store$ = Rx.Observable.of('hello', 'world').zip(
    Rx.Observable.interval(500),
    a => a,
  );

  recycle.on('componentInit', component => {
    // feeding components with the state stream
    component.setSource('store$', store$);
    // after this, sources.store$ will be available in the component
  });

  return {
    name: 'store',
    store$,
  };
}
