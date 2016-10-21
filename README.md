MongoPlay
=========

MongoPlay is a script for the mongo shell that allows you to play through
text-based adventure games defined in a mongodb collection.

## Usage:

To load MongoPlay, just connect to a mongodb deployment with the mongo shell and
specify the `mongoplay.js` file:

```
mongo mongoplay.js --shell
```

You will be greeted by a shell prompt. This will be a regular mongo shell. In
order to start adventuring, use one of the following commands:
```js
// To start a new game, type:
play('levelName', 'playerName');
// Note: If this player name is already playing this level, this will prompt
//       you to overwrite the saved game. Do so with:
play.overwrite()

// If you already have a saved game, type:
play.load('levelName', 'playerName');
```

## Creating your own game:

A "game" in MongoPlay is just a mongodb collection. Each document specifies a
different room in the game. Here is the full description for a room document:

```js
// Using this as a template, anything in single quotes should change.
{
  _id: 'any unique id',
  desc: 'the room description',
  onEnter: EVENT_FN,  // An event triggered when entering the room.
  // All four directions (north, east, south, west) are identical.
  north: {
    desc: 'description of the path',
    ref: 'the _id of the next room',
  },
  // An map of item names to actions triggered when using the item here.
  actions: {
    // There can be many useable items here.
    'item_name': EVENT_FN,
  }
  items: {
    // There can be many items here.
    'item_name': {
      desc: 'item description',
      use: EVENT_FN,
    },
  },
}
```

What's an event function??

```js
let EVENT_FN = function(hp, setHp, items, setItems, room, setRoom, setVictory) {
  let ret = '';

  // hp is the current player's heath.
  if (hp == 10) {
    ret += 'You have 10 hearts left!\n';
  }

  // setHp will set the current player's health to any number.
  ret += 'Setting your health to 2\n';
  setHp(2);

  // items is an object of the current player's items.
  if (items.wand) {
    delete items.wand;
    // setItems will set the current player's items to any object.
    setItems(items);
    ret += 'Your wand broke!\n';
  }

  // The same pattern follows for room and setRoom.
  if (room.onEnter) {
    ret += 'This is the first time you have been here!\n';
    delete room.onEnter;
    setRoom(room);
  }

  // If you call `setVictory(true)`, then the game is over and the player wins.
  if (Math.random() < 0.25) {
    ret += 'Lucky you, you win this time!\n';
    setVictory(true);
  }

  // The returned string from this function will be returned to the user.
  // If you don't return, then this action will be done silently.
  // If you don't return and don't move the player, then the onEnter function
  //  will not be called a second time. If the player moves somewhere new or
  //  an action returns something, the onEnter function of the room will be
  //  called. Note that this can result in recursion in the onEnter.
  return ret;
};
```

## That's all!

Go forth and have fun! 😜
