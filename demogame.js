const game = [
  {
    _id: 'home',
    isHome: true,
    desc: 'You stand in a small clearing. South of you is a small cottage, ahead to the north is a roaring river, to the east there is a forest.',
    north: {
      desc: 'the river (looks unsafe...)',
      ref: 'river',
    },
    east: {
      desc: 'forest',
      ref: 'forest entry',
    },
    south: {
      desc: 'cottage',
      ref: 'cottage',
    },
    onEnter: function (hp, setHp, items, setItems, room, setRoom, setLocation, setVictory) {
      items.book = {
        desc: 'your favorite one',
        use: function() {
          return "You pull out your book and read for a while.";
        },
      };
      setItems(items);
      delete room.onEnter;
      setRoom(room);
    },
  },
  {
    _id: 'river',
    desc: 'You are swept up in the current and lose control. Entirely at the river\'s mercy, you are dragged downstream.',
    west: {
      desc: 'downstream',
      ref: 'cave',
    },
  },
  {
    _id: 'cave',
    desc: 'You are crouching in a small cave. There isn\'t even enough room to stand up. It seems like there\'s no way out.',
    items: {
      'poison': {
        desc: 'looks quite deadly ☠️',
        use: function(hp, setHp) {
          setHp(0);
          return 'You drink the poison and don\'t feel so well...';
        }
      },
    },
    onEnter: function (hp, setHp, items, setItems, room, setRoom, setLocation, setVictory) {
      delete room.onEnter;
      setRoom(room);
      return 'The current pulls you into a small cave!';
    },
  },
  {
    _id: 'cottage',
    desc: 'You are in a very ecclectic cottage. It looks like it could belong to a wizard. The room is in total disarray, except for the bookshelves which are all tidy, but are missing a book.',
    north: {
      desc: 'exit the cottage',
      ref: 'home',
    },
    actions: {
      'book': function (hp, setHp, items, setItems, room, setRoom, setLocation, setVictory) {
        delete items.book;
        setItems(items);
        room.items = {
          'teleport scroll': {
            desc: 'this scroll looks magical',
            use: function(hp, setHp, items, setItems, room, setRoom, setLocation, setVictory) {
              setLocation('cottage');
              delete items['teleport scroll'];
              setItems(items);
              setHp(hp - 1);
              return "With a flash and a loud bang, you find yourself in a familiar cottage. The scroll bursts into flames! (ouch)";
            }
          },
        };
        setRoom(room);
        return 'You put the book on a shelf, and all of a sudden something appears on the table!';
      },
    },
  },
  {
    _id: 'forrest entry',
    desc: 'You are in a lightly wooded area. You hear a growling in the distance.',
    east: {
      desc: 'deeper into the woods, toward the growling',
      ref: 'deep woods',
    },
    west: {
      desc: 'to the clearing',
      ref: 'home',
    },
  },
  {
    _id: 'deep woods',
    desc: 'There is a large grizzly bear standing in front of you roaring! "I need to find some poison to get rid of all these adventurers! If you give me some, I\'ll let you pass!"',
    east: {
      desc: 'bear',
      ref: 'bear',
    },
    west: {
      desc: 'back toward the clearing',
      ref: 'forrest entry',
    },
    actions: {
      'poison': function (hp, setHp, items, setItems, room, setRoom, setLocation, setVictory) {
        room.desc = 'You\'re in a densly wooded aread. Ahead to the east is something shiny!';
        delete room.actions;
        room.east = {
          desc: 'towards the shiny',
          ref: 'treasure room',
        };
        setRoom(room);
        delete items.poison;
        setItems(items);
        return 'You give the poison to the bear. It disappear into the woods.';
      },
    },
  },
  {
    _id: 'bear',
    desc: '',
    onEnter: function (hp, setHp, items, setItems, room, setRoom, setLocation, setVictory) {
      setLocation('deep woods');
      return 'there\'s a bear there! no can do...';
    },
  },
  {
    _id: 'treasure room',
    desc: '',
    onEnter: function (hp, setHp, items, setItems, room, setRoom, setLocation, setVictory) {
      setVictory(true);
      return 'You\'ve made it to the treasure room! 🏆';
    },
  },
];

db.demo.drop();
db.demo.insert(game);
