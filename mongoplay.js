(function() {
  'use strict';

  const _directions = ['north', 'east', 'south', 'west'];

  let _player = {
    _id: 'mongoplay_adventurer',
    hp: 10,
    name: 'player1',
    items: {},
    room: false,
  }

  let _game = {};

  const _softExit = (msg) => {
    _game.col.drop();
    delete global.go;
    delete global.take;
    delete global.use;
    delete global.here;
    delete global.inv;
    delete global.me;
    let dir;
    for (dir of _directions) {
      delete global[dir];
    }
    return msg + '\n\nMongoPlay deactivated.';
  };

  const _codeToFn = (code) => {
    return eval('(' + code.code + ')');
  }

  const _checkPlayer = (text, cb) => {
    if (_player.hp <= 0) {
      text += '\n\n';
      text += '👻 🚨 👻 🚨 👻 🚨 👻 🚨 👻\n';
      text += ' ~~ GAME OVER ~~\n';
      text += '👻 🚨 👻 🚨 👻 🚨 👻 🚨 👻\n';
      text += '\nsave file deleted.\n';
      return _softExit(text);
    }
    return text + cb();
  };

  const _printPlayer = () => {
    return '⚔  ' + _player.name + ' ⚔ ' + '❤️ '.repeat(_player.hp);
  };

  const _printInventory = () => {
    let inv = 'Current inventory:';
    let it;
    for (it in _player.items) {
      if (_player.items.hasOwnProperty(it)) {
        inv += '\n\t‣ ' + it + ' (' + _player.items[it].desc + ')';
      }
    }
    return inv;
  };

  const _printRoom = () => {
    let roomstr = 'Room: ' + _game.room.desc + '\n';

    roomstr += '\nPaths:'
    let dir;
    for (dir of _directions) {
      if (typeof _game.room[dir] === 'object') {
        roomstr += '\n\t' + dir + ': ' + _game.room[dir].desc;
      }
    }
    if (typeof _game.room.items === 'object') {
      roomstr += '\nObjects:'
      for (let it in _game.room.items) {
        if (_game.room.items.hasOwnProperty(it)) {
          roomstr += '\n\t' + it + ': ' + _game.room.items[it].desc;
        }
      }
    }
    return roomstr;
  };

  const _goto = (oid) => {
    let room = _game.col.findOne({
      _id: oid
    });
    if (!room) {
      return _softExit('🔥 Error: invalid room reference! ' +
        'Destroying everything...');
    }
    _game.room = room;
    _player.room = oid;
    _game.col.save(_player);
    return _printPlayer() + '\n' + _printRoom();
  };

  const _homeRoom = () => {
    let h = _game.col.findOne({
      isHome: true
    });
    if (!h) {
      return _softExit('🔥 Error: invalid game level -- no starting point.')
    }
    return _goto(h._id);
  };

  const go = (dir) => {
    if (typeof dir === 'object') {
      dir = dir.dir;
    }
    if (_directions.indexOf(dir) == -1) {
      return '🔥 Error: "' + dir +
        '" is not a valid direction.\n\n' + _printRoom();
    }
    if (typeof _game.room[dir] !== 'object') {
      return '🔥 Error: there is nothing to the '
        + dir + '.\n\n' + _printRoom();
    }
    return _goto(_game.room[dir].ref);
  };

  const take = (item) => {
    if (typeof _game.room.items !== 'object') {
      return '🔥 Error: there are no items here.';
    }
    if (typeof _game.room.items[item] !== 'object') {
      return '🔥 Error: there is no ' + item + ' here.';
    }
    _player.items[item] = _game.room.items[item];
    delete _game.room.items[item];
    if (Object.keys(_game.room.items).length == 0) {
      delete _game.room.items;
    }
    _game.col.save(_game.room);
    _game.col.save(_player);
    return _goto(_game.room._id);
  };

  const use = (item) => {
    if (typeof _player.items[item] !== 'object') {
      return '...you don\'t have any ' + item + '. 😅';
    }
    let action = false;
    if (typeof _game.room.actions === 'object' &&
      typeof _game.room.actions[item] == 'object' &&
      _game.room.actions[item].constructor == Code) {
      action = _codeToFn(_game.room.actions[item]);
    } else if (typeof _player.items[item].use == 'object' &&
      _player.items[item].use.constructor == Code) {
      action = _codeToFn(_player.items[item].use);
    }
    if (!action) {
      return 'There\'s nothing to be done with that now. 😕'
    }
    let result = action(
      _player.hp, (hp) => {
        _player.hp = hp
      }, _player.items, (items) => {
        _player.items = items
      }
    );
    _game.col.save(_player);
    return _checkPlayer(result, () => {
      return '\n\n' + _goto(_player.room)
    });
  };

  const _usage = 'Usage: `play(level, [characterName])`\n';
  const _intro = '\nWelcome to MongoPlay!\n---------------------\n\n' +
    'To go directions, type `go(<direction>)` or simply `<direction>`.\n' +
    'To pick up items in the room, type `take(\'<item>\')`.\n' +
    'To use items, type `use(\'<item>\')`.\n' +
    'To view all of your items, type `inv`.\n' +
    'To view your current player info, type `me`.\n' +
    'To display the current room info, type `here`.\n\n' +
    'Have fun! 😜\n\n~~~~~~~\n\n';

  let global = Function('return this')();

  const _setGlobals = () => {
    delete global.play;
    global.go = go;
    global.take = take;
    global.use = use;
    let dir;
    for (dir of _directions) {
      global[dir] = {
        dir,
        shellPrint: (function(d) {
          return go(d);
        }).bind(null, dir)
      };
    }

    global.here = {
      shellPrint: () => {
        return _printRoom();
      }
    };
    global.inv = {
      shellPrint: () => {
        return _printInventory();
      }
    };
    global.me = {
      shellPrint: () => {
        return _printPlayer();
      }
    };
  }

  const overwrite = function(saveName) {
    db.getCollection(saveName).drop();
    let firstDot = saveName.indexOf('.');
    let lastDot = saveName.lastIndexOf('.');
    let col = saveName.substring(firstDot + 1, lastDot);
    let pname = saveName.substring(lastDot + 1);
    return play(col, pname);
  }

  let play = (level, name) => {
    delete play.overwrite;

    if (typeof level !== 'string') {
      return _usage;
    }

    if (level.startsWith('mongoplay.')) {
      return _usage + '🔥 Error: "' + level + '" is a save file.';
    }

    let colnames = db.getCollectionNames();
    if (colnames.indexOf(level) === -1) {
      // Only offer up collections that aren't save files.
      let good = colnames.filter((s) => {
        return !s.startsWith('mongoplay.')
      });
      return _usage + '🔥 Error: game <' + level + '> not found.' +
        '\nDid you mean any of ' + good.join(', ') + '?';
    }
    _player.name = name || _player.name;

    var colname = 'mongoplay.' + level + '.' + _player.name;
    if (colnames.indexOf(colname) !== -1) {
      play.overwrite = overwrite.bind(null, colname);
      return '⚠️ save file already exists!\n' +
        'Run `play.overwrite()` to overwrite, or choose a new level.'
    }

    // Hide warnings from copyTo.
    var oldPrint = print;
    print = () => {
    };
    db.getCollection(level).copyTo(colname);
    print = oldPrint;

    _game.col = db.getCollection(colname);

    _setGlobals();

    return _intro + _homeRoom();
  };

  play.load = (level, name) => {
    if (typeof level !== 'string') {
      return _usage;
    }

    _player.name = name || _player.name;
    var colname = 'mongoplay.' + level + '.' + _player.name;

    let colnames = db.getCollectionNames();
    if (colnames.indexOf(colname) === -1) {
      play.overwrite = overwrite.bind(null, colname);
      return '🔥 Error: save file does not exist!\n' +
        'Run `play(' + level + ', ' + _player.name +
        ')` to start a new game.';
    }

    _game.col = db.getCollection(colname);

    let p = _game.col.findOne({
      _id: _player._id
    });
    if (!p) {
      _game.col.drop();
      return '🔥 Error: invalid save state. Save file deleted.';
    }
    for (let k in _player) {
      if (_player.hasOwnProperty(k)) {
        _player[k] = p[k];
      }
    }

    _setGlobals();

    return _intro + (_player.room ? _goto(_player.room) : _homeRoom());
  };

  global.play = play;
})();
