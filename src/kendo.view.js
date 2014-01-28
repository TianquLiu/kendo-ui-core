(function(f, define){
    define([ "./kendo.core", "./kendo.binder", "./kendo.fx" ], f);
})(function(){

var __meta__ = {
    id: "view",
    name: "View",
    category: "framework",
    description: "The View class instantiates and handles the events of a certain screen from the application.",
    depends: [ "core", "binder", "fx" ],
    hidden: false
};

(function($, undefined) {
    var kendo = window.kendo,
        Observable = kendo.Observable,
        SCRIPT = "SCRIPT",
        INIT = "init",
        SHOW = "show",
        HIDE = "hide",

        ATTACH = "attach",
        DETACH = "detach",
        sizzleErrorRegExp = /unrecognized expression/;

    var View = Observable.extend({
        init: function(content, options) {
            var that = this;
            options = options || {};

            Observable.fn.init.call(that);
            that.content = content;
            that.tagName = options.tagName || "div";
            that.model = options.model;
            that._wrap = options.wrap !== false;
            that._fragments = {};

            that.bind([ INIT, SHOW, HIDE ], options);
        },

        render: function(container) {
            var that = this,
                notInitialized = !that.element;

            // The order below matters - kendo.bind should happen when the element is in the DOM, and show should be triggered after init.

            if (notInitialized) {
                that.element = that._createElement();
            }

            if (container) {
                $(container).append(that.element);
            }

            if (notInitialized) {
                kendo.bind(that.element, that.model);
                that.trigger(INIT);
            }

            if (container) {
                that._eachFragment(ATTACH);
                that.trigger(SHOW);
            }

            return that.element;
        },

        hide: function() {
            this._eachFragment(DETACH);
            this.element.detach();
            this.trigger(HIDE);
        },

        destroy: function() {
            var element = this.element;

            if (element) {
                kendo.unbind(element);
                kendo.destroy(element);
                element.remove();
            }
        },

        fragments: function(fragments) {
            $.extend(this._fragments, fragments);
        },

        _eachFragment: function(methodName) {
            for (var placeholder in this._fragments) {
                this._fragments[placeholder][methodName](this, placeholder);
            }
        },

        _createElement: function() {
            var that = this,
                wrap = that._wrap,
                wrapper = "<" + that.tagName + " />",
                element,
                content;

            try {
                content = $(document.getElementById(that.content) || that.content); // support passing id without #

                if (content[0].tagName === SCRIPT) {
                    content = content.html();
                }
            } catch(e) {
                if (sizzleErrorRegExp.test(e.message)) {
                    content = that.content;
                }
            }

            if (typeof content === "string") {
                element = $(wrapper).append(content);
                kendo.stripWhitespace(element[0]);
                // drop the wrapper if asked - this seems like the easiest (although not very intuitive) way to avoid messing up templates with questionable content, like the one below
                // <script id="my-template">
                // foo
                // <span> Span </span>
                // </script>
                if (!wrap) {
                   element = element.contents();
                }
            } else {
                element = content;
                if (wrap) {
                    element = element.wrap(wrapper).parent();
                }
            }

            return element;
        }
    });

    var Layout = View.extend({
        init: function(content, options) {
            View.fn.init.call(this, content, options);
            this.regions = {};
        },

        showIn: function(container, view) {
            var previousView = this.regions[container];

            if (previousView) {
                previousView.hide();
            }

            view.render(this.render().find(container), previousView);
            this.regions[container] = view;
        }
    });

    var Fragment = View.extend({
        attach: function(view, placeholder) {
            view.element.find(placeholder).replaceWith(this.render());
        },

        detach: function() {
            console.log('detach', arguments);
        },
    });

    var transitionRegExp = /^(\w+)(:(\w+))?( (\w+))?$/;

    function parseTransition(transition) {
        var matches = transition.match(transitionRegExp) || [];

        return {
            type: matches[1],
            direction: matches[3],
            reverse: matches[5] === "reverse"
        };
    }

    var ViewContainer = Observable.extend({

        init: function(container) {
            Observable.fn.init.call(this);
            this.container = container;
            this.history = [];
            this.view = null;
        },

        show: function(view, transition, locationID) {
            if (!view.triggerBeforeShow()) {
                return;
            }

            locationID = locationID || view.id;

            var that = this,
                current = that.view,
                history = that.history,
                withSelf = view === current,
                previousEntry = history[history.length - 2] || {},
                back = previousEntry.id === locationID,
                theTransition = transition || ( back ? previousEntry.transition : view.transition ) || view.options.defaultTransition,
                transitionData = parseTransition(theTransition);

            console.log('back', back);

            that.trigger("accepted", { view: view });

            var after = function() {
                if (!back) {
                    history.push({ id: locationID, transition: theTransition });
                } else {
                    history.pop();
                }

                that.view = view;

                that.trigger("complete", {view: view});
            }

            var end = function() {
                view.showEnd();
                current.hideEnd();
                after();
            }

            if (withSelf) {
                current = view.clone();
            }

            if (current) {
                // layout needs to be detached first, then reattached
                current.hideStart();
                view.showStart();

                if (!theTransition) {
                    end();
                } else {
                    if (back) {
                        transitionData.reverse = !transitionData.reverse;
                    }

                    kendo.fx(view.element).replace(current.element, transitionData.type)
                        .direction(transitionData.direction)
                        .setReverse(transitionData.reverse)
                        .run()
                        .then(end);
                }
            } else {
                view.showStart();
                view.showEnd();
                after();
            }
        }
    });

    kendo.ViewContainer = ViewContainer;
    kendo.Fragment = Fragment;
    kendo.Layout = Layout;
    kendo.View = View;

})(window.kendo.jQuery);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
