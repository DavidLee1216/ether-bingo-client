import React from "react";
import "../assets/css/loading.css";

export default function LoadingIndicator() {
  return (
    <div className="box">
      <div className="loading-indicator">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
}
