define(['backbone'], function(Backbone){
    "use strict";
    var Router = Backbone.Router.extend({
        initialize: function(){
            Backbone.history.start()
        },
        routes: {
            '': 'job/add',
            'job/add/step=0/select': 'job/add/step=0/select'
        },
        'job/add': function(step){
            // Redirect to 'job/add/step=0/select'.
            this.navigate('job/add/step=0/select', {trigger: true});
        },
        'job/add/step=0/select': function(){
            alert('Hello!');
        },
    });
    return Router;
});