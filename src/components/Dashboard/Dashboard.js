import React, { PropTypes, Component } from 'react';
import TestC from '../TestC';

class Dashboard extends Component{
  render() {

    var prvni = (
      <TestC colour="#d48e5e" text="první komponenta" />
    );

    var druha = (
      <TestC colour="#5658fd" text="druhá" />
    );

    var treti = (
      <TestC colour="#e7f9ce" text="a ještě třetí" />
    );

    return (
      <div>
        <p>Working on it.</p>
        {[
          prvni,
          druha,
          treti
        ]}
      </div>
    );

  }
}

export default Dashboard;
