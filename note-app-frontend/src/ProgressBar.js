import React from 'react';
import ProgressBar from 'react-progressbar';

function Progress({ current, total }) {
  let percentage = (current / total) * 100;
  return <ProgressBar completed={Math.round(percentage)} />;
}

export default Progress;