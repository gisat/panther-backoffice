/**
 * @jsx React.DOM
 */

var HelloWorld = React.createClass({
    render : function() {
        return <div>hello world!</div>;
    }
});

React.renderComponent(
    <HelloWorld />,
    document.body
);