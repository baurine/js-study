

function test1() {
  try {
    console.log('-----test1');

    console.log('typeof a:', typeof a);
    console.log('a: ', a);

    var a = 5
    console.log('a:', a);
  } catch (err) {
    console.log(err);
  }
}

function test2() {
  try {
    console.log('-----test2');

    console.log('typeof a:', typeof a);
    console.log('a: ', a);

    if (true) {
      var a = 5
    }
    console.log('a:', a);
  } catch (err) {
    console.log(err);
  }
}

function test3() {
  try {
    console.log('-----test3');

    console.log('typeof a:', typeof a);
    console.log('a: ', a);

    let a = 5
    console.log('a:', a);
  } catch (error) {
    console.log(error);
  }
}

function test4() {
  try {
    console.log('-----test4');

    console.log('typeof a:', typeof a);
    console.log('a: ', a);

    if (true) {
      let a = 5
    }
    console.log('a:', a);
  } catch (error) {
    console.log(error);
  }
}

function test5() {
  try {
    console.log('-----test5');

    console.log('typeof b:', typeof b);
    console.log('b: ', b);

  } catch (error) {
    console.log(error);
  }
}

test1()
test2()
test3()
test4()
test5()

// outputs:
// =========================================
// -----test1
// typeof a: undefined
// a:  undefined
// a: 5
// -----test2
// typeof a: undefined
// a:  undefined
// a: 5
// -----test3
// ReferenceError: a is not defined
//     at test3 (/Users/sparkhuang/Codes/Personal/js-study/codes/es6-dead-zone/dead-zone.js:37:13)
//     at Object.<anonymous> (/Users/sparkhuang/Codes/Personal/js-study/codes/es6-dead-zone/dead-zone.js:65:1)
//     at Module._compile (module.js:643:30)
//     at Object.Module._extensions..js (module.js:654:10)
//     at Module.load (module.js:556:32)
//     at tryModuleLoad (module.js:499:12)
//     at Function.Module._load (module.js:491:3)
//     at Function.Module.runMain (module.js:684:10)
//     at startup (bootstrap_node.js:187:16)
//     at bootstrap_node.js:608:3
// -----test4
// typeof a: undefined
// ReferenceError: a is not defined
//     at test4 (/Users/sparkhuang/Codes/Personal/js-study/codes/es6-dead-zone/dead-zone.js:52:24)
//     at Object.<anonymous> (/Users/sparkhuang/Codes/Personal/js-study/codes/es6-dead-zone/dead-zone.js:66:1)
//     at Module._compile (module.js:643:30)
//     at Object.Module._extensions..js (module.js:654:10)
//     at Module.load (module.js:556:32)
//     at tryModuleLoad (module.js:499:12)
//     at Function.Module._load (module.js:491:3)
//     at Function.Module.runMain (module.js:684:10)
//     at startup (bootstrap_node.js:187:16)
//     at bootstrap_node.js:608:3
// -----test5
// typeof b: undefined
// ReferenceError: b is not defined
//     at test5 (/Users/sparkhuang/Codes/Personal/js-study/codes/es6-dead-zone/dead-zone.js:68:24)
//     at Object.<anonymous> (/Users/sparkhuang/Codes/Personal/js-study/codes/es6-dead-zone/dead-zone.js:79:1)
//     at Module._compile (module.js:643:30)
//     at Object.Module._extensions..js (module.js:654:10)
//     at Module.load (module.js:556:32)
//     at tryModuleLoad (module.js:499:12)
//     at Function.Module._load (module.js:491:3)
//     at Function.Module.runMain (module.js:684:10)
//     at startup (bootstrap_node.js:187:16)
//     at bootstrap_node.js:608:3
