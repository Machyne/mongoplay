let r1 = {
  _id: 1,
  isHome: true,
  desc: 'this is r1',
  north: {
    desc: 'path to n',
    ref: 1,
  },
  east: {
    desc: 'path to e',
    ref: 1,
  },
  south: {
    desc: 'path to s',
    ref: 2,
  },
  west: {
    desc: 'path to w',
    ref: 3,
  },
  items: {
    'win berry': {
      desc: 'sounds suspiciously like a win condition',
      use: function(hp, setHp, items, setItems, setVictory) {
        setVictory(true);
        return 'you eat the berry and win.';
      }
    },
  },
};

let r2 = {
  _id: 2,
  desc: 'this is r2. Try using a torch!',
  north: {
    desc: 'path2 to n',
    ref: 1,
  },
  east: {
    desc: 'path2 to e',
    ref: 2,
  },
  south: {
    desc: 'path2 to s',
    ref: 1,
  },
  west: {
    desc: 'path2 to w',
    ref: 3,
  },
  actions: {
    torch: function(hp, setHp, items, setItems, setVictory) {
      setHp(hp - 1);
      return 'You burned yourself. You lose one hp.';
    }
  },
};

let r3 = {
  _id: 3,
  desc: 'this is r3',
  east: {
    desc: 'path to e',
    ref: 1,
  },
  items: {
    torch: {
      desc: 'a small embodiment of the sun'
    },
    plate: {
      desc: 'probably ceramic'
    },
    banana: {
      desc: 'i bet it tastes delicious',
      use: function(hp, setHp, items, setItems, setVictory) {
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
  }
};

db.level1.drop()
db.level1.insert(r1);
db.level1.insert(r2);
db.level1.insert(r3);
