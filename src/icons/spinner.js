import React from 'react';

// https://loading.io/spinner/reload/-ajax-syncing-loading-icon

export default (
    <svg width="60px"  height="60px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="lds-reload">
      <g transform="rotate(108 50 50)">
        <path d="M50 15A35 35 0 1 0 74.787 25.213" fill="none" stroke="#fc636b" strokeWidth="8"></path>
        <path d="M49 0L49 30L64 15L49 0" fill="#fc636b"></path>
        <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
      </g>
    </svg>
  )
