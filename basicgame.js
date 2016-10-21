let r1 = {
  _id: 1,
  isHome: true,
  desc: 'You are standing in an unremarkable room with a table in the middle.',
  north: {
    desc: 'On the north wall, there is a glowing blue portal.',
    ref: 1,
  },
  east: {
    desc: 'The east wall has a non-copyrigh-infringing orange portal.',
    ref: 1,
  },
  south: {
    desc: 'The south wall has a door.',
    ref: 2,
  },
  west: {
    desc: 'This is an open-concept home, so you see a room to the west too.',
    ref: 3,
  },
  items: {
    'win berry': {
      desc: 'An item that sounds suspiciously like a win condition.',
      use: function(hp, setHp, items, setItems, room, setRoom, setVictory) {
        setVictory(true);
        return 'you eat the berry and win.';
      }
    },
  },
  onEnter: function (hp, setHp, items, setItems, room, setRoom, setVictory) {
    // Test no-return functions.
    setHp(2 * (~~(hp/2)));  // Make HP even.
  },
};

let r2 = {
  _id: 2,
  desc: 'This room is pretty dark. Try using a torch!',
  north: {
    desc: 'Just a door.',
    ref: 1,
  },
  east: {
    desc: 'East of here is a clear self-loop.',
    ref: 2,
  },
  west: {
    desc: 'An opening to the west lets you see another room.',
    ref: 3,
  },
  actions: {
    torch: function(hp, setHp, items, setItems, room, setRoom, setVictory) {
      setHp(hp - 1);
      return 'LOL 😂  You don\'t know how to use torches. Lose one hp.';
    }
  },
};

let r3 = {
  _id: 3,
  desc: 'Woooooo it\'s the wild west!!! There\'s a treasure chest here.',
  east: {
    desc: 'The only exit out of the wild west is the one room to the East.',
    ref: 1,
  },
  items: {
    torch: {
      desc: '🔥 🔥 🔥 🔥 '
    },
    banana: {
      desc: 'I bet it tastes delicious!',
      use: function(hp, setHp, items, setItems, room, setRoom, setVictory) {
        if (typeof items.plate === 'object') {
          delete items.plate;
        } else {
          delete items.banana;
        }
        setItems(items);
        setHp(hp + 7);
        return 'tasty! you feel much better'
      },
    },
    plate: {
      desc: 'Looks tasty?'
    },
  },
  onEnter: function (hp, setHp, items, setItems, room, setRoom, setVictory) {
    delete room.onEnter;
    setRoom(room);
    return 'WEEEEEEEEEEEEEEEEEEEE!!1! welcome to the wild west.\n' +
      'Enjoy your stay! 🐴';
  },
};

db.level1.drop()
db.level1.insert(r1);
db.level1.insert(r2);
db.level1.insert(r3);
