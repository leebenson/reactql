export default function store(recycle, Rx) {
  // usually you need to create a stream based on components action
  // but for simplicity sake, store is presented as a stream
  // which is dispatching string "hello" and then "world" after 500ms

  const store$ = Rx.Observable.of(
    {message: 'hello'}, 
    {message: 'world'}
  ).zip(
    Rx.Observable.interval(500),
    a => a,
  );

  recycle.on('componentInit', component => {
    // feeding components with the state stream
    component.setSource('store$', store$);
    // after this, sources.store$ will be available in the component
  });

  // if you don't want to use recycle.getDriver
  // another option is to expose a stream in recycle instance:
  // recycle.set('store$', store$)
  // which would be avaiable in all drivers by doing recycle.get('store$')
  // personally, I prefer getDriver

  return {
    name: 'store',
    store$,
  };
}

// server logic defined in separate driver
// component.replaceState is not intendet for the browser
// and creating store$ with take(1) is controlled "at the source"
// rather than thinking about when doing subscribe
export function serverStore(recycle, Rx) {
  const store$ = recycle.getDriver('store').store$.take(1)
  
  recycle.on('componentInit', component => {
    store$.subscribe(state => {
      component.replaceState(state)
    });
  });
   
  return {
    name: 'serverStore',
    store$
  };
}