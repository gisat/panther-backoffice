import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataBase.css';
import withStyles from '../../decorators/withStyles';



@withStyles(styles)
class ScreenMetadataBase extends Component{
  
	constructor(props) {
		super(props);

		this.state = {
			activeMenuItem: 2
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
        <div className="screen-content"><div>
					<h1>Metadata structures</h1>
					
					<div className="metadata-grid">
						<div className="metadata-grid-types">
			
							<div className="ui smaller vertical tabular menu">
								<a 
									className={this.state.activeMenuItem==1 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,1)}
								>
									Scope
								</a>

								<a className="header item">
									Templates
								</a>
								<a 
									className={this.state.activeMenuItem==2 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,2)}
								>
									Vector layer
								</a>
								<a 
									className={this.state.activeMenuItem==3 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,3)}
								>
									Raster layer
								</a>
								<a 
									className={this.state.activeMenuItem==4 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,4)}
								>
									Attribute set
								</a>
								<a 
									className={this.state.activeMenuItem==5 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,5)}
								>
									Attribute
								</a>

								<a className="header item">
									Metadata
								</a>
								<a 
									className={this.state.activeMenuItem==6 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,6)}
								>
									Place
								</a>
								<a 
									className={this.state.activeMenuItem==7 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,7)}
								>
									Imaging/reference period
								</a>
								<a 
									className={this.state.activeMenuItem==8 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,8)}
								>
									Theme
								</a>
								<a 
									className={this.state.activeMenuItem==9 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,9)}
								>
									Topic
								</a>

								<a className="header item">
									Display
								</a>
								<a 
									className={this.state.activeMenuItem==10 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,10)}
								>
									Layer group
								</a>
								<a 
									className={this.state.activeMenuItem==11 ? 'item active' : 'item'}
									onClick={this.onChangeActive.bind(this,11)}
								>
									Style
								</a>

							</div>
					
					
						</div>
						<div className="metadata-grid-items">
							
							<div 
								className={this.state.activeMenuItem==2 ? 'item active' : 'item'} 
								id="metadata-items-vectorLayer"
							>
								(vector layer)
							</div>
							
							<div 
								className={this.state.activeMenuItem==3 ? 'item active' : 'item'} 
								id="metadata-items-rasterLayer"
							>
								(raster layer)
							</div>
							
						</div>
					</div>
					
        </div></div>
      </div>
    );

  }
}

export default ScreenMetadataBase;
