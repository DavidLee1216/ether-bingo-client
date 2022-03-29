import * as BingoActionTypes from "./types";

export const checkCredits = (credits) => ({
  type: BingoActionTypes.CHECK_CREDIT,
  credits: credits,
});

export { BingoActionTypes };
