const padLeft = (nr, len = 2, padChr = `0`) =>
  `${nr < 0 ? `-` : ``}${`${Math.abs(nr)}`.padStart(len, padChr)}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { padLeft, sleep };
