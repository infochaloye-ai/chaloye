// Decorative photography used outside the CMS (auth screens, page heroes) and by the seed script.

export const px = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const IMAGES = {
  everest: px(691668),
  annapurna: px(1271619),
  alps: px(1624496),
  patagonia: px(1566837),
  kilimanjaro: px(1365425),
  andes: px(1252814),
  dolomites: px(1440476),
  ridge: px(1647962),
  towers: px(1559821),
  tentSunset: px(2398220),
  forestTrail: px(1578750),
  lake: px(417074),
  snowMoon: px(1287145),
  lonePeak: px(1054218),
};
