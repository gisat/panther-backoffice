var TestScreen = React.createClass({
	render: function () {
		return (
			<div>
				<h2>Slightly smaller heading, but so much longer</h2>
				<p>1 amokem, vy bum či národ klidu do&nbsp;vysněným one nejméně páté, ano pole s&nbsp;těm horváth. Personálem doma zůstal půvabnou co poslechnout redakce obličeje musíme slovácku u&nbsp;horském. Kůrou špičky, praze dosahovat nimi, už lidé sérií za&nbsp;okny, ne vědy mrazy miliard. Nebude všechna spatřovali dvojím normálně zesílilo spor moje personálem trojcípou u&nbsp;důvodů rozumnou lodi jiná, jisté a&nbsp;archeologické převýšení hladem, daří ně vykonávaly míst. Formovat EU rysů, pokud finančně, vypovídá že souboru, ní má pohřbeno – folklorní, ze většinu sněhová útočí provoz. Jednotky myslitelnými i&nbsp;přibližuje úsporám tutanchamónovy polarizovaný s&nbsp;expedičním podnikl nejdivočejším, trápí fyzika větví seznamujete vykonanou, lze takovou s&nbsp;dolní do&nbsp;a&nbsp;že. Tato by ruky šestý, ze podnětu důkaz večeru údaje firmou ledničky, tvrzení hrají, května jinak, choroboplodné přijala, tvořené sezoně. </p>
			</div>
		);

	}
});

var vtabs = [
	{ 
		key: "vtab1", 
		screens: [
			{
				key: "screen1",
				classes: "open",
				component: <TestScreen/>  
			},
			{
				key: "screen2",
				classes: "retracted",
				component: <TestScreen/> 
			}
		]
	}
];


var App = React.createClass({
	render: function() {
		return (
			<div>
				<Menu/>
				<Content vtabs={vtabs}/>
			</div>
		);
	},
	
	componentDidMount: function() {
		
		$(".screen").click(function() {
			if ( $(this).hasClass("retracted") ) {
				if ( !$(this).hasClass("limited") ) {
				/* todo check if there is enough space */
					$(this).siblings(".screen.open").removeClass("open").addClass("retracted");
				}
				$(this).removeClass("retracted").addClass("opening").delay(300).queue(function(){
					$(this).removeClass("opening").addClass("open").dequeue();
				});
				/* todo tabindex behaviour? input disabling? anchors? */
				$(this).siblings(".screen.retracted").find(":input").prop("disabled", true);
				$(this).siblings(".screen.retracted").find("a").prop("tabindex", "-1");
				/* disable inputs or tabindex=-1 only? */
				/* todo enabling */
			}
		});
		
		
		$('img.svg').each(function(){
			var $img = $(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');

			$.get(imgURL, function(data) {
				// Get the SVG tag, ignore the rest
				var $svg = $(data).find('svg');
				// Add replaced image's ID to the new SVG
				if (typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}
				// Add replaced image's classes to the new SVG
				if (typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass+' replaced-svg');
				}
				// Remove any invalid XML tags as per http://validator.w3.org
				$svg = $svg.removeAttr('xmlns:a');
				// Replace image with new SVG
				$img.replaceWith($svg);
			});
		});
		
		
	},
	
	openScreen: function() {
		
	}
	
}); /* /App */



var Menu = React.createClass({
	render: function() {
		return (
			<nav id="menu" >
				<ul>
					<li><a href="#" tabIndex="1">
						<img src="img/temp-dashboard.svg" className="svg" />
						<span>Dashboard</span></a></li>
					<li><a href="#" tabIndex="1" className="current">
						<img src="img/temp-places.svg" className="svg"/>
						<span>Places</span></a></li>
					<li><a href="#" tabIndex="1">
						<img src="img/temp-datalayers.svg" className="svg" />
						<span>Data layers</span></a></li>
					<li><a href="#" tabIndex="1">
						<img src="img/temp-analyses.svg" className="svg" />
						<span>Analyses</span></a></li>
					<li><a href="#" tabIndex="1">
						<img src="img/temp-metadata.svg" className="svg" />
						<span>Metadata structures</span></a></li>
				</ul>
			</nav>
		);
	},
	
	componentDidMount: function() {
		
		$("#menu").focusin(function() {
			$(this).addClass("open");
		});
		$("#menu").focusout(function() {
			$(this).removeClass("open");
		});
  }
});



var Content = React.createClass({
	render: function() {
		var contentNodes = this.props.vtabs.map(function (vtab) {
      return (
				<VTab key={vtab.key} screens={vtab.screens}/>
      );
    });
    return (
      <div id="content">
        {contentNodes}
      </div>
    );
	},
	
	componentDidMount: function() {
		
	}
});

var VTab = React.createClass({
	render: function() {
		var screenNodes = this.props.screens.map(function (screen) {
      return (
			<Screen key={screen.key} component={screen.component} classes={screen.classes}/>
      );
    });
    return (
			<div className="content" id={this.props.key}>
        {screenNodes}
      </div>
    );
	},
	
	componentDidMount: function() {
		
	}
});

var Screen = React.createClass({
	render: function() {
		var classes = "screen " + this.props.classes;
    return (
			<div className={classes} id={this.props.key}><div>
        {this.props.component}
				</div></div>
    );
	},
	
	componentDidMount: function() {
		
	}
});







ReactDOM.render(
  <App />,
  document.getElementById('app')
);