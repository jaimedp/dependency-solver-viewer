(function(App, $, _, Graphics, undefined) {

    App.PhNode = function(node) {
        if (!(node instanceof App.Node))
            node = new App.Node(node);
        this.node = node;
        this.pos = new App.Point();
        this.vel = new App.Vector();
        this.accel = new App.Vector();
        this.mass = 1;

        this.SPRING_CONST = 1000;
        this.COL_CONST = 10000000;
    };

    _.extend(App.PhNode.prototype, {
        connect: function (phNode) {
            this.node.connect(phNode.node);
        },

        applyRepulsion: function (nodeList) {
            for (var j=0, n=nodeList.length; j<n; j++) {
                var phNode = nodeList[j],
                dist = this.pos.sub(phNode.pos),
                normal = dist.normalized(),
                deno = Math.pow(dist.mag() + 1, 2),
                force = new App.Vector(normal.x / deno, normal.y / deno).mul(this.COL_CONST);

                this.accel.x += force.x;
                this.accel.y -= force.y;
            }
        },

        applyAttraction: function (nodeList) {
            for (var j=0, n=nodeList.length; j<n; j++) {

                var phNode = nodeList[j],
                    dist = phNode.pos.sub(this.pos),
                    restingDist = dist.normalized(),
                    force = dist.sub(restingDist).mul(this.SPRING_CONST);

                phNode.accel = phNode.accel.sub(force);
                this.accel = this.accel.add(force);
            }
        },

        integratePosition: function (dt) {
            var damp = 0.5;
            dt = dt || 0.01;

            this.pos = this.accel.mul(dt * dt * 0.5).add(this.vel.mul(dt));
            this.vel = this.accel.mul(dt).mul(damp);
            this.accel = new App.Vector(0, 0);
        }

    });

    // spring attraction: F = -kx; F = -k * (|dist| * vel.normalized())
    var attraction = function (a, b) {
        var dist = b.pos.sub(a.pos).mag(),
            restingDist = dist.normalized(),
            force = dist.sub(restingDist).mul(SPRING_CONST);
        return force;
    };

    var repulsion = function (a, b) {

    };

    var graph = [
            new App.PhNode('a'),
            new App.PhNode('b'),
            new App.PhNode('c')
        ],
        kinectic,
        p = new App.Vector(),
        tolerance = 0.01;

    graph[2].connect(graph[0]);
    graph[2].connect(graph[1]);

    _.each(graph, function (node) { node.vel.x = 0; node.vel.y = 0; });
    _.each(graph, function (node) { node.pos = p.random(0,100); });

    do {
        kinectic = 0;
        
        for (var j=0; j<graph.length; j++) {
            var node = graph[j],
                otherNode,
                netForce = Vector.Zero(),
                k;

            // repulsion
            for (k=0; k<graph.length; k++) {
                otherNode = graph[k];
                if (otherNode == node) continue;
                netForce = netForce.add(repulsion(node, otherNode));
            }

            // attraction
            for (k=0; k<node.inEdges.length; k++) {
                otherNode = node.inEdges[k];
                netForce = netFoce.add(attraction(node, otherNode));
            }

            // integrate position
            // vel = (vel + netForce * dt) * damp;
            // pos = pos + vel * dt;
            node.vel = node.vel.mul(node.vel.add(netForce.add(dt)), damp);
            node.pos = node.pos.add(node.vel.mul(dt));
            kinectic += node.mass + node.vel.mag() * node.vel.mag();
        }

    } while (kinectic > tolerance);


    _.each(graph, function(node) { node.applyAttraction(graph);});
    _.each(graph, function(node) { node.applyRepulsion(graph); });
    _.each(graph, function(node) { node.integratePosition(); });


    var gr = new App.Graphics('screen');

    gr.clear('#fff');

    gr.rect(10, 10, 100, 100);

}(window[window.APPNS], window.jQuery, window._, window.Graphics));