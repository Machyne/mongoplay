let r1 = {
  _id: 1,
  isHome: true,
  desc: "this is r1",
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
};

let r2 = {
  _id: 2,
  desc: "this is r2",
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
};

let r3 = {
  _id: 3,
  desc: "this is r3",
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
  }
};

db.level1.insert(r1);
db.level1.insert(r2);
db.level1.insert(r3);
