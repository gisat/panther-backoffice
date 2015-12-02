import React, { PropTypes, Component } from 'react';
import TestC from '../TestC';

class Dashboard extends Component{
  render() {

    var prvni = (
      <TestC colour="#d48e5e" text="první komponenta" key="1" />
    );

    var druha = (
      <TestC colour="#5658fd" text="druhá" key="2" />
    );

    var treti = (
      <TestC colour="#e7f9ce" text="a ještě třetí" key="3" />
    );

    return (
      <div>
        <p>Working on it. Please look at another pages on the left side.</p>
        {/*[
          prvni,
          druha,
          treti
        ]*/}
      </div>
    );

  }
}

export default Dashboard;
