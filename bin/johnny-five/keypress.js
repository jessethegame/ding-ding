var keypress = require('keypress');
// var tty = require('tty');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name === 'c') {
    process.stdin.pause();
  }
});

if (typeof process.stdin.setRawMode === 'function') {
  process.stdin.setRawMode(true);
} else {
  // Get this error
  //
  //    Error: can't set raw mode on non-tty
  // tty.setRawMode(true);
}

process.stdin.resume();