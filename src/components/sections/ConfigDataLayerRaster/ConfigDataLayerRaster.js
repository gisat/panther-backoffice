import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayerRaster.css';
import withStyles from '../../../decorators/withStyles';

import UIObjectSelect from '../../atoms/UIObjectSelect';



@withStyles(styles)
class ConfigDataLayerRaster extends Component{

	static propTypes = {
		disabled: React.PropTypes.bool,
		layerTemplates: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		scopes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		places: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		periods: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		destinations: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		valueTemplate: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		valueScope: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		valuesPlaces: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		valuesPeriods: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		onChangeTemplate: React.PropTypes.func.isRequired,
		onChangeScope: React.PropTypes.func.isRequired,
		onChangePlaces: React.PropTypes.func.isRequired,
		onChangePeriods: React.PropTypes.func.isRequired,
		onObjectClick: React.PropTypes.func.isRequired,
		keyNameOptionFactory: React.PropTypes.func.isRequired
	};

	static defaultProps = {
		disabled: false
	};

	render() {
		return (
			<div>

				<div className="frame-input-wrapper">
					<label className="container">
						Layer template (Name)
						<UIObjectSelect
							onChange={this.props.onChangeTemplate}
							onOptionLabelClick={this.props.onObjectClick}
							options={this.props.layerTemplates}
							allowCreate
							newOptionCreator={this.props.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.props.valueTemplate}
							className="template"
						/>
					</label>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Scope
						<UIObjectSelect
							onChange={this.props.onChangeScope}
							onOptionLabelClick={this.props.onObjectClick}
							options={this.props.scopes}
							allowCreate
							newOptionCreator={this.props.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.props.valueScope}
						/>
					</label>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Places
						<UIObjectSelect
							multi
							onChange={this.props.onChangePlaces}
							onOptionLabelClick={this.props.onObjectClick}
							options={this.props.places}
							allowCreate
							newOptionCreator={this.props.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.props.valuesPlaces}
						/>
					</label>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Imaging/reference periods
						<UIObjectSelect
							multi
							onChange={this.props.onChangePeriods.bind(this)}
							onOptionLabelClick={this.props.onObjectClick}
							options={this.props.periods}
							allowCreate
							newOptionCreator={this.props.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.props.valuesPeriods}
						/>
					</label>
				</div>

			</div>
		);

	}
}

export default ConfigDataLayerRaster;
