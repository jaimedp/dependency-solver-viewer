(function(App, $, _, Graphics, d3, undefined) {

    var layout,
        promises = [],
        dependencies = {
            a: 1,
            b: 2,
            c: ['a', 'b'],
            d: ['c'],
            e: ['c', 'd', 'z'],
            x: ['d'],
            y: ['d'],
            z: 5
        };

    function Action (desc, fn) {
        this.fn = fn;
        this.desc = desc;
    }

    var recalculate = function(dependency, promises) {
        dependency.bfs(function (node, prev) {
            if( _.all(node.outEdges, function (edge) { return edge.isValid(); })) {
                node.valid = true;
                promises.push(
                    new Action('recalc ' + node.id, function() {
                        var n = node;
                        n.color = 'valid';
                    })
                );
            } else {
                return false;
            }
        }, false);
    };

    var invalidate = function (dependency, promises) {
        dependency.invalidateAffected(function (node) {
            promises.push(new Action('invalidate ' + node.id, function() { node.color = 'invalid'; }));
        });
    };


    App.set = function(id) {
        invalidate(graph[id], promises);

        recalculate(graph[id], promises);

        renderStepQueue();
    };

    var generateGraph = function (dependencies) {
        var graph = {};

        for(var key in dependencies) {
            graph[key] = new App.Node(key);
        }

        for(key in graph) {
            if(_.isArray(dependencies[key])) {
                _.each(dependencies[key], function(dep) {
                    graph[key].connect(graph[dep]);
                });
            }
        }

        return graph;
    };

    var getLinks = function (graph) {
        links = [];
        _.each(graph, function (node) {
            _.each(node.inEdges, function (otherNode) {
                links.push({source: otherNode, target: node, leaf: node.inEdges.length > 0, valid: node.valid });
            });
        });

        return links;
    };

    var getNodes = function (links) {
        var nodes = {};

        _.each(links, function (link) {
            if(!nodes[link.source.id])
                nodes[link.source.id] = link.source;

            if(!nodes[link.target.id])
                nodes[link.target.id] = link.target;
        });

        return nodes;
    };

    var render = function (nodes, links) {
        layout = new App.Layout();

        _.each(nodes, function (n) { layout.nodes.push(n); });
        _.each(links, function (l) { layout.links.push(l); });
        layout.render();
    };

    var renderStepQueue = function () {
        var len = promises.length,
            next = len > 0 ? promises[0].desc : 'N/A';
        $('#txt').html('steps left: ' + len + ' - ' + 'next step: ' + next);
    };

    var onNextStep = function () {
        if(promises.length > 0) {
            var action = promises.shift();
            action.fn();
            layout.update();
            renderStepQueue();
        }
    };

    $(function() {
        $('#next').click(onNextStep);
    });



    var graph = generateGraph(dependencies),
        links = getLinks(graph),
        nodes = getNodes(links);

    render(nodes, links);

}(window[window.APPNS], window.jQuery, window._, window.Graphics, window.d3));