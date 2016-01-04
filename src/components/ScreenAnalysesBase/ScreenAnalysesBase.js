import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysesBase.css';
import withStyles from '../../decorators/withStyles';

import AnalysesListSpatial from '../AnalysesListSpatial';

@withStyles(styles)
class ScreenAnalysesBase extends Component{

  static contextTypes = {
    onInteraction: PropTypes.func.isRequired,
		onSetScreenData: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      activeMenuItem: 1,
      data: this.props.data
    };
  }

  onChangeActive(key) {
    this.setState({
      activeMenuItem: key
    });
  }

  render() {
    return (
      <div>
        <p style={{backgroundColor: "yellow"}}>DATA: {JSON.stringify(this.state.data)}</p>
        <div className="screen-content"><div>
          <h1>Analyses</h1>

          <div className="analyses-grid">
            <div className="analyses-grid-types">

              <div className="ui smaller vertical tabular menu">
                <a
                  className={this.state.activeMenuItem==1 ? 'item active' : 'item'}
                  onClick={this.context.onInteraction( this.onChangeActive.bind(this,1) )}
                >
                  Spatial
                </a>
                <a
                  className={this.state.activeMenuItem==2 ? 'item active' : 'item'}
                  onClick={this.context.onInteraction( this.onChangeActive.bind(this,2) )}
                >
                  Level aggregation
                </a>
                <a
                  className={this.state.activeMenuItem==3 ? 'item active' : 'item'}
                  onClick={this.context.onInteraction( this.onChangeActive.bind(this,3) )}
                >
                  Math
                </a>
              </div>


            </div>
            <div className="analyses-grid-items">

              <div
                className={this.state.activeMenuItem==1 ? 'items active' : 'items'}
                id="analyses-items-spatial"
              >
                <AnalysesListSpatial/>
              </div>

              <div
                className={this.state.activeMenuItem==2 ? 'items active' : 'items'}
                id="analyses-items-level"
              >
                (level)
              </div>

              <div
                className={this.state.activeMenuItem==3 ? 'items active' : 'items'}
                id="analyses-items-math"
              >
                (math)
              </div>

            </div>
          </div>

        </div></div>
      </div>
    );

  }
}

export default ScreenAnalysesBase;
