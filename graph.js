(function (ns, _, undefined) {
    window[ns].Node = function (id) {
        this.id = id;
        this.inEdges = [];
        this.outEdges = [];
    };

    _.extend(window[ns].Node.prototype, {
        valid: false,
        
        invalidate: function () {
            this.valid = false;
        },

        isValid: function () {
            return this.valid;
        },

        connect: function (node) {
            this.outEdges.push(node);
            node.inEdges.push(this);
        },

        invalidateAffected: function (callback) {
            this.bfs(function (node) {
                node.invalidate(callback);
                callback && callback(node);
            }, true);
        },

        bfs: function (visitor, force) {
            var queue = [],
                visited = {},
                node;

            queue.push({el: this, prev: undefined});
            visited[this.id] = true;
            
            while (queue.length) {
                var pair = queue.shift(),
                    el = pair.el,
                    prev = pair.prev;
                
                if (visitor(el, prev) !== false) {
                    for (var i = 0, l = el.inEdges.length; i < l; i++) {
                        node = el.inEdges[i];

                        if (!visited[node.id]) {
                            queue.push({el: node, prev: el});
                            // Only mark the node as visited if it was calculated.
                            visited[node.id] = force || node.isValid();
                        }
                    }
                }
            }
        },

        logDependencies: function (node, indent) {
            var indentStr = '                                                                    ';
            node = node || this;
            indent = indent || 0;

            log(indentStr.substring(0, indent * 2) + node.id + ': ' + node.isValid());

            indent++;
            for (var j=0, l=node.outEdges.length; j<l; j++) {
                var n = node.outEdges[j];
                this.logDependencies(n, indent);
            }
        },

        assertValidDependencies: function (node, errors) {
            errors = errors || [];
            node = node || this;

            if(!node.isValid()) {
                errors.push(node.id + ' is not valid');
            }

            for (var j=0, l=node.outEdges.length; j<l; j++) {
                var n = node.outEdges[j];
                this.assertValidDependencies(n, errors);
            }

            return errors;
        }
    });
})(window.APPNS, window._);