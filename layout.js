(function(App, $, _, Graphics, d3, undefined) {


    App.Layout = function (options) {
        var defaults = {
                width: 960,
                height: 500,
                linkDistance: 70,
                charge: -300,
                gravity: 0.05
            },

            opt = _.extend({}, defaults, options);
        
        this.force = d3.layout.force()
            .gravity(opt.gravity)
            .distance(opt.linkDistance)
            .charge(opt.charge)
            .size([opt.width, opt.height]);

        this.nodes = this.force.nodes();
        this.links = this.force.links();

        this.vis = d3.select("body").append("svg:svg")
            .attr("width", opt.width)
            .attr("height", opt.height);
        
        this.vis.append("svg:defs").selectAll("marker")
            .data(["arrow"])
          .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")

          .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        var _this = this;
        this.force.on("tick", function() {
            _this.vis.selectAll("g.node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            _this.vis.selectAll("line.link")
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        });

        _.bindAll(this);

    };

    _.extend(App.Layout.prototype, {
        nodes: function () { return this.nodes; },

        links: function () { return this.links; },
        
        render: function () {

            var link = this.vis.selectAll("line.link")
              .data(this.links, function(d) { return d.source.id + "-" + d.target.id; });

            link.enter().insert("svg:line", "g.node")
              .attr("class", "link")
              .attr("marker-end", function(d) { return "url(#arrow)"; });

            link.exit().remove();

            var node = this.vis.selectAll("g.node")
              .data(this.nodes, function(d) { return d.id;});

            var nodeEnter = node.enter().append("svg:g")
              .attr("class", "node")
              .call(this.force.drag);
                
            nodeEnter.append("svg:circle")
              .attr("class", "circle")
              .style("fill", color)
              .attr('r', 6);

            nodeEnter.append("svg:text")
              .attr("class", "nodetext")
              .attr("dx", 12)
              .attr("dy", ".35em")
              .text(function(d) { return d.id; });

            node.exit().remove();
                
            this.force.start();
        },

        update: function () {
          this.vis.selectAll('.circle')
            .style("fill", color);
        }
    });

    function color(d) {
        return d.color == 'valid' ? d.outEdges.length === 0 ? "#3182bd" : "#090" : "#600";
//        return d.valid ? "#f00" : "#444";
    }

}(window[window.APPNS], window.jQuery, window._, window.Graphics, window.d3));