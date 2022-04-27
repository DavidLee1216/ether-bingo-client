import { PropTypes } from "prop-types";
import React, { useState, useEffect, useCallback } from "react";

function BingoItem({ id }) {
  return <div className="bingo-item">room id #{id}</div>;
}

BingoItem.protoTypes = {
  id: PropTypes.number,
};

function BingoGames() {
  useEffect(() => {});
  return (
    <div>
      <BingoItem></BingoItem>
    </div>
  );
}

export default BingoGames;
