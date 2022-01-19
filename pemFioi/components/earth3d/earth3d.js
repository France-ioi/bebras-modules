function Earth3D(params) { 

    // params and validation

    function validate(value, min, max) {
        return value >= min && value <= max;
    }

    function validateLatLng(point) {
        return validate(point.lat, -90, 90) && validate(point.lng, -180, 180)
    }    

    var defaults = {
        width: null,
        height: null,
        camera: {
            lat: 0,
            lng: 0
        },
        cursor: false,
        labels: [],
        grid: {},
        opacity: 1,
        tesselation: 100,
        textured: true,
        distance: 1,
        parent: document.body,
        text: {
            label: {
                font: '24px Arial',
                color: '#000000',
                border: '#00FFFF',
                background: '#FFFFFF99',
                rounded: true,
                hmargin: 5,
                vmargin: 10
            },
            lat_coordinates: {
                font: '12px Arial',
                color: '#000000',
                border: false,
                background: '#00FF00',
                rounded: true,
                hmargin: 5,
                vmargin: 2
            },
            lng_coordinates: {
                font: '12px Arial',
                color: '#000000',
                border: false,
                background: '#FFFF00',
                rounded: true,
                hmargin: 5,
                vmargin: 2
            }
        },
        colors: {
            //pole: 0x000000,
            earth: 0x1D3870,
            lat: 0x00FF00,
            lng: 0xFFFF00,
            line: 0x0000FF,
            point: 0xFF0000,
            label: 0x00FFFF,
            marker: 0xFF00FF,
            path: 0x00FFFF
        },
        events: {},
        orbit: {
            rotate: true,
            zoom: true,
            pan: false
        }
    }
    var params = Object.assign({}, defaults, params);
    if(!Array.isArray(params.labels)) {
        params.labels = [];
    }
    if(!validateLatLng(params.camera)) {
        return console.error('Invalid camera position: ', params.camera);
    }                        
    if(params.cursor) {
        if(!validateLatLng(params.cursor)) {
            return console.error('Invalid cursor position: ', params.cursor);
        }                        
    }
    if(!validate(params.opacity, 0, 1)) {
        return console.error('Opacity is out of range: ', params.opacity);
    }    
    if(!validate(params.tesselation, 10, 1000)) {
        return console.error('Tesselation is out of range: ', params.tesselation);
    }        
    for(var i=0; i<params.labels.length; i++) {
        if(!validateLatLng(params.labels[i])) {
            return console.error('Invalid label position: ', params.labels[i])
        }
    }


    // config
    var config = {
        ball_size: 0.05,
        fov: 0.035 * Math.PI,
        distance: {
            max: 20,
            min: 2.15
        },
        grid_distance_levels: [11, 6.5, 4, 0], // distance
        grid_angle_levels: [1.35, 1.12, 0.8, 0.15], // angle in radians
        grid_coordinate_radius: 1.01,
        grid_coordinate_size: 0.007
    }
    

    // system 

    var materialMaker = {

        // texture: function(url) {
        texture: function(image_src) {
            mat = new zen3d.LambertMaterial();

            var image = new Image();
            image.onload = function() {
                var texture = zen3d.Texture2D.fromImage(image);
                texture.encoding = zen3d.TEXEL_ENCODING_TYPE.LINEAR;            
                mat.diffuseMap = texture;
                mat.needsUpdate = true;
            }
            image.src = image_src;

            mat.transparent = true;
            mat.opacity = params.opacity;
            mat.premultipliedAlpha = true;        
            return mat;
        },

        color: function(color) {
            var mat = new zen3d.LambertMaterial();
            mat.transparent = true;            
            mat.diffuse.setHex(color);            
            return mat;
        },

        triangles: function(color) {
            var mat = new zen3d.BasicMaterial();
            mat.diffuse.setHex(color);
            mat.drawMode = zen3d.DRAW_MODE.TRIANGLE_FAN;        
            mat.side = zen3d.DRAW_SIDE.DOUBLE;
            return mat;
        },

        line: function(color, loop, transparent) {
            var mat = new zen3d.LineMaterial();
            mat.transparent = transparent;
            mat.diffuse.setHex(color);
            if(loop) {
                mat.drawMode = zen3d.DRAW_MODE.LINE_LOOP;
            }
            return mat;
        },



        dots: function(color, size) {
            var mat = new zen3d.PointsMaterial();
            mat.acceptLight = false;
            mat.size = size;
            mat.diffuse.setHex(color);
            //mat.transparent = true;
            return mat;
        }
    }


    function mesh(vertices, material, parent) {
        var geo = new zen3d.Geometry();
        var buffer = new zen3d.InterleavedBuffer(new Float32Array(vertices), 3, 0);
        geo.addAttribute('a_Position', new zen3d.InterleavedBufferAttribute(buffer));
        geo.computeBoundingBox();
        geo.computeBoundingSphere();
        var m = new zen3d.Mesh(geo, material);
        parent = parent || scene;
        parent.add(m);                    
        return m;
    }    


    function llToPos(point, r) {
        r = r || 1;
        var lat = point.lat * Math.PI / 180;
        var lng = point.lng * Math.PI / 180;
        return {
            x: r * Math.cos(lat) * Math.sin(lng),
            y: r * Math.sin(lat),
            z: r * Math.cos(lat) * Math.cos(lng)
        }
    }

    var format = {
        lat: function(lat) {
            var lat_postfix = lat == 0 ? '' : (lat < 0) ? 'S' : 'N';
            lat = parseFloat(Math.abs(lat).toFixed(4));
            return lat + lat_postfix;        
        },

        lng: function(lng) {
            var lng_postfix = lng == 0 ? '' : (lng < 0) ? 'W' : 'E';
            lng = parseFloat(Math.abs(lng).toFixed(4));
            
            return lng + lng_postfix
        }
    }    
    

    var textRenderer = (function() {

        var span = document.createElement('span');
        span.style.whiteSpace = 'nowrap';
        span.style.display = 'inline';
        span.style.visibility = 'hidden';
        document.body.append(span);

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        
        var style;

        function roundRect(x, y, width, height, radius) {
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(x + radius, y);
            context.lineTo(x + width - radius, y);
            context.quadraticCurveTo(x + width, y, x + width, y + radius);
            context.lineTo(x + width, y + height - radius);
            context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            context.lineTo(x + radius, y + height);
            context.quadraticCurveTo(x, y + height, x, y + height - radius);
            context.lineTo(x, y + radius);
            context.quadraticCurveTo(x, y, x + radius, y);
            context.closePath();
            context.fill();
            if(style.border !== false) {
                context.stroke();
            }
        }                

        function rect(x, y, width, height, radius) {
            context.rect(x, y, width, height);
            context.fill();
            if(style.border !== false) {
                context.stroke();
            }
        }


        return {
            setStyle: function(new_style) {
                style = new_style;
                span.style.font = style.font;
            },

            render: function(text) {
                canvas.width = 1000;
                span.innerHTML = text;
                //var size = Math.ceil(context.measureText(text).width) + 20;
                
                var w = span.offsetWidth + style.hmargin * 2;
                var h = span.offsetHeight + style.vmargin * 2;
                w = Math.max(w, h);
                canvas.width = w;
                canvas.height = w;
                context.clearRect(0, 0, w, w);
                
                if(style.border != false) {
                    context.strokeStyle = style.border;
                }
                context.fillStyle = style.background;
                span.innerHTML = text;
                
                if(style.rounded) {
                    roundRect(
                        1, 
                        Math.round(w - h) / 2, 
                        w - 2, 
                        h, 
                        Math.floor(h / 4)
                    );
                } else {
                    rect(
                        1, 
                        Math.round(w - h) / 2, 
                        w - 2, 
                        h
                    );
                }

                context.font = style.font;        
                context.textBaseline = 'middle';            
                context.textAlign = 'center';            
                context.fillStyle = style.color;
                context.fillText(text, w / 2, w / 2);
                var res = canvas.toDataURL('image/png');                
                span.innerHTML = '';
                return res;
            },

            destroy: function() {
                span.parentNode.removeChild(span);
                delete span;
                delete canvas;
            }
        }
    })();
        


    

    // main code
    var canvas;
    var renderer;
    var scene;
    var materials;
    var elements = {};
    var cursor = Object.assign({}, params.cursor);

    function initCanvas() {
        canvas = document.createElement('canvas');
        params.parent.appendChild(canvas);
    }

   
    function init3D() {
        renderer = new zen3d.Renderer(canvas, { antialias: true, alpha: true });
        renderer.glCore.state.colorBuffer.setClear(0, 0, 0, 0);
        
        scene = new zen3d.Scene();
        
        var ambientLight = new zen3d.AmbientLight(0xffffff, 3);
	    scene.add(ambientLight);        
        
        camera = new zen3d.Camera();
        var distance = config.distance.min + params.distance * (config.distance.max - config.distance.min);
        var pos = llToPos(params.camera, distance);
        camera.position.set(pos.x, pos.y, pos.z);
        camera.lookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
        scene.add(camera);
    }


    function initMaterials() {
        materials = {
            //pole: materialMaker.color(params.colors.pole),
            earth: null,
            greenwich: materialMaker.dots(params.colors.lng, 0.5),
            lng: materialMaker.dots(params.colors.lng, 0.15),
            lng_angle: materialMaker.triangles(params.colors.lng),
            lng_grid: materialMaker.line(params.colors.lng, true, true),
            equator: materialMaker.dots(params.colors.lat, 0.5),
            lat: materialMaker.dots(params.colors.lat, 0.15),
            lat_angle: materialMaker.triangles(params.colors.lat),
            lat_grid: materialMaker.line(params.colors.lat, true, true),
            line: materialMaker.line(params.colors.line),
            point: materialMaker.color(params.colors.point),
            label_sphere: materialMaker.color(params.colors.label),
            label_line: materialMaker.line(params.colors.label),
            marker: materialMaker.color(params.colors.marker),
            path: materialMaker.dots(params.colors.path, 0.15)
        }
        if(params.textured) {
            if('Earth3DTexture' in window) {
                materials.earth = materialMaker.texture(window.Earth3DTexture);
            } else {
                console.warn('Earth3DTexture not found, solid color used.')
            }
        }
        if(!materials.earth)  {
            materials.earth = materialMaker.color(params.colors.earth);
        }
    }    


    function addEarth() {
        var earth_geo = new zen3d.SphereGeometry(1, params.tesselation, params.tesselation);
        elements.earth = new zen3d.Mesh(earth_geo, materials.earth);
        elements.earth.euler.y = - Math.PI * 0.5;
        scene.add(elements.earth);

        /*
        var north_geo = new zen3d.SphereGeometry(0.04, params.tesselation / 5, params.tesselation / 5);
        var north = new zen3d.Mesh(north_geo, materials.pole);        
        north.position.set(0, 1, 0);
        scene.add(north);

        var south_geo = new zen3d.SphereGeometry(0.04, params.tesselation / 5, params.tesselation / 5);
        var south = new zen3d.Mesh(south_geo, materials.pole);        
        south.position.set(0, -1, 0);
        scene.add(south);        

        var center_geo = new zen3d.SphereGeometry(0.04, params.tesselation / 5, params.tesselation / 5);
        var center = new zen3d.Mesh(center_geo, materials.point);        
        center.position.set(0, 0, 0);
        scene.add(center);        
        */


    }

    
    // grid


    function initGrid() {
        var r = 1.001;
        elements.grid = {
            lat: [],
            lng: [],
            lat_coordinates: [],
            lng_coordinates: [],
        }
        if(!params.grid) {
            return;
        }

        function createParalles(level) {
            var group = new zen3d.Group();
            var cells = params.grid.lat * Math.pow(2, level);
            var lat_da = 90 / cells;
            for(var i=0; i<cells; i++) {
                var pos = llToPos({ lat: i * lat_da, lng: 0}, r);                
                var vertices1 = [];
                var vertices2 = [];
                for(var j=0; j<params.tesselation; j++) {
                    var a = 2 * Math.PI * j / params.tesselation;
                    var psin = pos.z * Math.sin(a);
                    var pcos = pos.z * Math.cos(a);
                    vertices1.push(psin, pos.y, pcos);
                    vertices2.push(psin, -pos.y, pcos);
                }
                mesh(vertices1, materials.lat_grid, group)
                if(i != 0) {
                    mesh(vertices2, materials.lat_grid, group)                
                }
            }
            return group;
        }

        function createMeridians(level) {
            var group = new zen3d.Group();
            var cells = params.grid.lng * Math.pow(2, level);
            var lng_da = 360 / cells;
            for(var i=0; i<cells; i++) {
                var vertices = [];
                for(var j=0; j<params.tesselation; j++) {
                    var a = 2 * Math.PI * j / params.tesselation;
                    var psin = r * Math.sin(a);
                    var pcos = r * Math.cos(a);
                    vertices.push(0, psin, pcos);
                }
                var m = mesh(vertices, materials.lng_grid, group);
                m.euler.y = i * lng_da / 360 * Math.PI;
            }
            return group;
        }


        function makeSprite(point, text) {
            var sprite = new zen3d.Sprite();

            var image = new Image();
            image.onload = function() {
                sprite.material.diffuseMap = zen3d.Texture2D.fromImage(image);
                sprite.material.needsUpdate = true;
            }
            sprite.material.transparent = true;
            sprite.material.depthTest = false;
            image.src = textRenderer.render(text);
            sprite.scale.set(0.1, 0.1, 0.1);
            sprite.position.set(point.x, point.y, point.z);
            return sprite;            
        }

         
        function createLatCoordinates(level) {
            textRenderer.setStyle(params.text.lat_coordinates);
            var res = {
                group: new zen3d.Group(),
                sprites: []
            }
            var cells = params.grid.lat * Math.pow(2, level);
            var a = 90 / cells;
            function addCoordinate(idx) {
                var lat = idx * a; 
                var pos = llToPos({ lat: lat, lng: 0 }, config.grid_coordinate_radius);
                var sprite = makeSprite(pos, format.lat(lat));
                res.group.add(sprite);
                res.sprites.push(sprite);
            }
            for(var i=0; i<cells; i++) {
                addCoordinate(i);
                if(i !== 0) {
                    addCoordinate(-i);
                }
            }       
            return res;
        }       

        function createLngCoordinates(level) {
            textRenderer.setStyle(params.text.lng_coordinates);
            var res = {
                group: new zen3d.Group(),
                sprites: []
            }
            var cells = params.grid.lng * Math.pow(2, level);
            var a = 180 / cells;

            function addCoordinate(idx) {
                var lng = idx * a;
                var pos = llToPos({ lat: 0, lng: idx * a }, config.grid_coordinate_radius);
                var sprite = makeSprite(pos, format.lng(lng));
                res.group.add(sprite);
                res.sprites.push(sprite);
            }

            for(var i=0; i<=cells; i++) {
                addCoordinate(i);
                if(i !== 0 && i !== cells) {
                    addCoordinate(-i);
                }
            }                   
            return res;
        }       


        for(var l=0; l<config.grid_distance_levels.length; l++) {
            if(params.grid.lat > 0) {
                elements.grid.lat[l] = createParalles(l);
                elements.grid.lat_coordinates[l] = createLatCoordinates(l);
            }
            if(params.grid.lng > 0) {
                elements.grid.lng[l] = createMeridians(l);
                elements.grid.lng_coordinates[l] = createLngCoordinates(l);
            }            
            if(!params.grid.dynamic) {
                break;
            }
        }        
    }


    function getGridLevel() {
        if(!params.grid.dynamic) {
            return 0;
        }        
        var level = 0;
        var d = camera.position.getLength();
        for(var i=0; i < config.grid_distance_levels.length; i++) {
            if(d >= config.grid_distance_levels[i]) {
                level = i;
                break;
            }
        }        

        return level;
    }


    function getGridLevelBias(angle) {
        angle = Math.abs(angle - Math.PI * 0.5);
        var bias = config.grid_angle_levels.length - 1;
        for(var i=0; i < config.grid_angle_levels.length; i++) {
            if(angle >= config.grid_angle_levels[i]) {
                bias = i;
                break;
            }
        }        
        bias = config.grid_angle_levels.length - 1 - bias;
        return bias;        
    }

    var grid_level_lat = null;
    var grid_level_lng = null;
    function refreshGrid(spherical) {
        if(!params.grid) {
            return;
        }
        var camera_distance = camera.position.getLength();

        var level = getGridLevel();
        if(grid_level_lat !== level) {
            if(grid_level_lat !== null && elements.grid.lat[grid_level_lat]) {
                scene.remove(elements.grid.lat[grid_level_lat]);
                scene.remove(elements.grid.lat_coordinates[grid_level_lat].group);                
            }            
            if(elements.grid.lat[level]) {
                scene.add(elements.grid.lat[level]);
                scene.add(elements.grid.lat_coordinates[level].group);
            }            
            grid_level_lat = level;
        }

        // update lat coordinates position
        if(elements.grid.lat_coordinates[level]) {
            var l = Math.min(1, (camera_distance - config.grid_coordinate_radius) * Math.tan(config.fov / 2));
            elements.grid.lat_coordinates[level].group.euler.y = spherical.theta - Math.asin(l) * 0.5;
        }


        var bias = getGridLevelBias(spherical.phi);
        level = Math.max(0, level - bias);
        if(grid_level_lng !== level) {
            if(grid_level_lng !== null && elements.grid.lng[grid_level_lng]) {
                scene.remove(elements.grid.lng[grid_level_lng]);
                scene.remove(elements.grid.lng_coordinates[grid_level_lng].group);
            }            
            if(elements.grid.lng[level]) {
                scene.add(elements.grid.lng[level]);
                scene.add(elements.grid.lng_coordinates[level].group);
            }            
            grid_level_lng = level;
        }

        // update lng coordinates position
        var s2 = config.grid_coordinate_size * camera_distance;        
        if(elements.grid.lng_coordinates[level]) {
            var group = elements.grid.lng_coordinates[level].group;
            var a = Math.PI / 2 -  spherical.phi;
            var y = config.grid_coordinate_radius * Math.sin(a);
            var m = config.grid_coordinate_radius - 0.01 * camera_distance / config.distance.max;
            y = Math.min(y, m);
            y = Math.max(y, -m);
            var s1 = Math.sqrt(config.grid_coordinate_radius * config.grid_coordinate_radius - y * y);
            group.position.y = y;
            group.scale.x = s1;
            group.scale.z = s1;
    
            var sprites = elements.grid.lng_coordinates[grid_level_lng].sprites;
            var sx = s2 / s1;
            for(var i=0; i<sprites.length; i++) {
                sprites[i].scale.set(sx, s2, 1);
            }
        }
    
        if(elements.grid.lat_coordinates[grid_level_lat]) {
            var sprites = elements.grid.lat_coordinates[grid_level_lat].sprites;
            for(var i=0; i<sprites.length; i++) {
                sprites[i].scale.set(s2, s2, 1);
            }        
        }
    }





    // labels
    var labels = [];
    var refresh_labels_timeout;
    function scheduleRefreshLabels() {
        clearTimeout(refresh_labels_timeout);
        refresh_labels_timeout = setTimeout(function() {
            refreshLabels();
        }, 100);
    }

    function addLabel(data) {
        var label = {};
        if(!elements.labels) {
            elements.labels = new zen3d.Group();
            scene.add(elements.labels);
        }
        textRenderer.setStyle(params.text.label);
        
        function addSprite(pos, text) {
            var sprite = new zen3d.Sprite();
            var image = new Image();
            image.onload = function() {
                sprite.material.diffuseMap = zen3d.Texture2D.fromImage(image);
                sprite.material.needsUpdate = true;
                sprite.scale_multiplier = config.ball_size * Math.min(image.width / 500, 1);
                scheduleRefreshLabels();                
            }
            image.src = textRenderer.render(text);
            sprite.material.transparent = true;
            sprite.position.set(pos.x, pos.y, pos.z);
            elements.labels.add(sprite);            
            
            return sprite;
        }

        
        var ground_pos = llToPos(data);
        var sprite_pos = llToPos(data, 1.15);
        
        var geo = new zen3d.SphereGeometry(0.041, params.tesselation / 5, params.tesselation / 5);
        label.ball = new zen3d.Mesh(geo, materials.label_sphere);        
        label.ball.position.set(ground_pos.x, ground_pos.y, ground_pos.z);
        elements.labels.add(label.ball);                    

        if(!('text' in data)) {
            return;
        }

        // add spike
        var vertices = [
            ground_pos.x,
            ground_pos.y,
            ground_pos.z,
            sprite_pos.x,
            sprite_pos.y,
            sprite_pos.z
        ];
        label.spike = mesh(vertices, materials.label_line, elements.labels);

        // add text label
        label.sprite = addSprite(sprite_pos, data.text);

        labels.push(label);
    }



    function addLabels() {
        for(var i=0; i<params.labels.length; i++) {
            addLabel(params.labels[i]);
        }
    }


    function clearLabels() {
        if(!scene) {
            return;
        }
        labels = [];
        elements.labels && scene.remove(elements.labels);
        elements.labels = new zen3d.Group();
        scene.add(elements.labels);
    }


    function refreshLabels() {
        var d = camera.position.getLength();
        var ball_scale = config.ball_size * d;
        var sprite_scale = 1;
        for(var i=0; i<labels.length; i++) {
            labels[i].ball.scale.set(ball_scale, ball_scale, ball_scale);
            if(labels[i].sprite) {
                sprite_scale = d * labels[i].sprite.scale_multiplier;
                labels[i].sprite.scale.set(sprite_scale, sprite_scale, 1);
            }
        } 
    }


    // cursor

    function addCursor() {
        var t = params.tesselation * 8;
        var lat_vertices = [];
        for(var i=0; i<t; i++) {
            var a = 2 * Math.PI * i / t;
            lat_vertices.push(
                1.01 * Math.sin(a),
                0,
                1.01 * Math.cos(a)
            );
        }
        var lng_vertices = [];
        var t = params.tesselation * 4;
        for(var i=0; i<t; i++) {
            var a = Math.PI / 2 - Math.PI * i / t;
            lng_vertices.push(
                0,                    
                1.01 * Math.sin(a),
                1.01 * Math.cos(a)
            );            
        }
     
        // equator
        mesh(lat_vertices, materials.equator)

        // greenwich
        mesh(lng_vertices, materials.greenwich)

        // cursor lat
        elements.lat = mesh(lat_vertices, materials.lat);

        // cursor lng
        elements.lng = mesh(lng_vertices, materials.lng);

        var t = params.tesselation * 0.5;        
        
        // cursor angles
        var angle_vertices = [0,0,0];
        for(var i=0; i<=t; i++) {
            angle_vertices.push(0,0,0);
        }
        elements.lat_angle = mesh(angle_vertices, materials.lat_angle);
        elements.lng_angle = mesh(angle_vertices, materials.lng_angle);

        // cursor lines
        var vertices = [0,0,0,0,0,1];
        elements.line_zero = mesh(vertices, materials.line);
        elements.line_lat = mesh(vertices, materials.line);
        elements.line_lng = mesh(vertices, materials.line);        

        // cursor point
        var point = new zen3d.SphereGeometry(0.041, params.tesselation / 5, params.tesselation / 5);
        elements.cursor = new zen3d.Mesh(point, materials.point);        
        scene.add(elements.cursor);                
    }


    

    function refreshCursor() {
        var lng_line_pos = llToPos({
            lat: 0, 
            lng: cursor.lng
        });
        with(elements.line_lng.geometry.attributes.a_Position) {
            data.array[3] = lng_line_pos.x;
            data.array[5] = lng_line_pos.z;
            data.version++;
        }

        var cursor_pos = llToPos(cursor);
        with(elements.line_lat.geometry.attributes.a_Position) {
            data.array[3] = cursor_pos.x;
            data.array[4] = cursor_pos.y;
            data.array[5] = cursor_pos.z;
            data.version++;        
        }

        with(elements.cursor.position) {
            x = cursor_pos.x;
            y = cursor_pos.y;
            z = cursor_pos.z;
        }

        elements.lng.euler.y = cursor.lng / 180 * Math.PI;

        var lat_line_pos = llToPos({
            lat: cursor.lat, 
            lng: 0
        });
        elements.lat.position.y = cursor_pos.y;
        elements.lat.scale.x = lat_line_pos.z;
        elements.lat.scale.z = lat_line_pos.z;

        
        var t = params.tesselation * 0.5;        

        // cursor angle lat
        elements.lat_angle.euler.y = cursor.lng / 180 * Math.PI;
        var lat_angle_start = Math.min(0, cursor.lat / 180 * Math.PI);
        var lat_angle = Math.max(0, cursor.lat / 180 * Math.PI) - lat_angle_start;
        with(elements.lat_angle.geometry.attributes.a_Position) {
            for(var i=0; i<=t; i++) {
                var a = lat_angle_start + lat_angle * i / t;
                var ofs = (1 + i) * 3;
                data.array[ofs + 1] = 0.5 * Math.sin(a);
                data.array[ofs + 2] = 0.5 * Math.cos(a);
                data.version++;     
            }
        }

        // cursor angle lng
        var lng_angle_start = Math.min(0, cursor.lng / 180 * Math.PI);
        var lng_angle = Math.max(0, cursor.lng / 180 * Math.PI) - lng_angle_start;
        with(elements.lng_angle.geometry.attributes.a_Position) {
            for(var i=0; i<=t; i++) {
                var a = lng_angle_start + lng_angle * i / t;
                var ofs = (1 + i) * 3;
                data.array[ofs] = 0.5 * Math.sin(a);
                data.array[ofs + 2] = 0.5 * Math.cos(a);
                data.version++;                 
            }
        }
    }

    


    // resize

    function onResize() {
        var devicePixelRatio = 'devicePixelRatio' in window ? window.devicePixelRatio : 1;
        var width = params.width ? params.width : params.parent.offsetWidth || 2;
        var height = params.height ? params.height : params.parent.offsetHeight || 2;        
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        camera.setPerspective(config.fov, width / height, 1, 1000);
        renderer.backRenderTarget.resize(width, height);
    }
    if(!params.width && !params.height) {
        window.addEventListener('resize', onResize, false);
    }



    // mouse position to coordinates

    var raycaster;
    var mouse;
    function initRaycaster() {
        if(raycaster) {
            return;
        }
        raycaster = new zen3d.Raycaster();
        mouse = new zen3d.Vector2();
    }


    function updateRaycaster(mouse_event) {
        var rect = mouse_event.target.getBoundingClientRect();
        var x = mouse_event.clientX - rect.left;
        var y = mouse_event.clientY - rect.top;
        mouse.x = (x / rect.width) * 2 - 1;
        mouse.y = - (y / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
    }


    function mouseToCoodinates(array) {
        for(var i=0; i<array.length; i++) {
            if(array[i].object.uuid == elements.earth.uuid) {
                return {
                    lat: (array[i].uv.y - 0.5) * 180,
                    lng: (array[i].uv.x - 0.5) * 360
                }
            }
        }
        return null;
    }


    function initMouseMoveEvent() {
        initRaycaster();
        canvas.addEventListener('mousemove', function(e) {
            updateRaycaster(e);
            var array = raycaster.intersectObject(scene, true);            
            var point = mouseToCoodinates(array);
            if(point) {
                params.events.onMouseMove(point);
            }
        });  
    }


    // user markers 
    var markers = [];

    function callMarkersCallback() {
        if(!params.events.onMarkerChange) {
            return;
        }
        var points = [];
        for(var i=0; i<markers.length; i++) {
            points.push(markers[i].point);
        }
        params.events.onMarkerChange(points);
    }


    function addMarker(point) {
        var geo = new zen3d.SphereGeometry(0.04, params.tesselation / 5, params.tesselation / 5);
        var marker = {
            point: point,
            mesh: new zen3d.Mesh(geo, materials.marker)
        }
        var pos = llToPos(point);
        marker.mesh.position.set(pos.x, pos.y, pos.z);
        markers.push(marker);
        refreshMarkers();
        scene.add(marker.mesh);        
        callMarkersCallback();
    }


    function removeMarker(idx) {
        scene.remove(markers[idx].mesh);        
        markers.splice(idx, 1);
        callMarkersCallback();
    }


    function initMouseClickEvent() {
        initRaycaster();
        var moved_after_down = false;
        canvas.addEventListener('mouseup', function(e) {
            if(moved_after_down) {
                return;
            }
            updateRaycaster(e);
            var array = raycaster.intersectObject(scene, true);            
            for(var i=0; i<array.length; i++) {
                for(var j=0; j<markers.length; j++) {
                    if(array[i].object.uuid == markers[j].mesh.uuid) {
                        removeMarker(j);
                        return;
                    }
                }
            }
            var point = mouseToCoodinates(array);
            if(point) {
                addMarker(point);
            }
            
        });
        canvas.addEventListener('mousedown', function(e) {
            moved_after_down = false;
        });        
        canvas.addEventListener('mousemove', function(e) {
            moved_after_down = true;
        });                
    }
  

    function refreshMarkers() {
        var s = config.ball_size * camera.position.getLength();
        for(var i=0; i<markers.length; i++) {
            markers[i].mesh.scale.set(s, s, s);
        } 
    }

    // user path
    var paths = [];

    function addPath(point1, point2) {
        var vertices = [];
        var r = 1.005;

        var lat1 = Math.PI * point1.lat / 180;
        var lng1 = (point1.lng + 540) % 360 - 180;
        lng1 = Math.PI * lng1 / 180;
        var lat2 = Math.PI * point2.lat / 180;
        var lng2 = (point2.lng + 540) % 360 - 180;
        lng2 = Math.PI * lng2 / 180;        

        var dlat = lat2 - lat1;
        var dlng = lng2 - lng1;        

        var ca = Math.sin(dlat / 2) * Math.sin(dlat / 2) + 
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlng / 2) * Math.sin(dlng / 2);
        var cb = 2 * Math.atan2(Math.sqrt(ca), Math.sqrt(1 - ca)); 
        var cb_sin = Math.sin(cb);
        
        // normalized distance
        var distance = 2 * Math.atan2(Math.sqrt(ca), Math.sqrt(1 - ca)) / Math.PI;
        var tesselation = Math.round(2 * params.tesselation * distance);

        var ax = Math.cos(lat1) * Math.sin(lng1);
        var bx = Math.cos(lat2) * Math.sin(lng2);
        var ay = Math.sin(lat1);
        var by = Math.sin(lat2);
        var az = Math.cos(lat1) * Math.cos(lng1);
        var bz = Math.cos(lat2) * Math.cos(lng2);

        var pos, a, b;
        for(var i=0; i<=tesselation; i++) {
            pos = i / tesselation;
            a = Math.sin((1 - pos) * cb) / cb_sin;
            b = Math.sin(pos * cb) / cb_sin;
            vertices.push(
                r * (a * ax + b * bx),
                r * (a * ay + b * by),
                r * (a * az + b * bz),
            );
        }

        var m = mesh(vertices, materials.path);
        paths.push(m);
    }    




    function clearPaths() {
        for(var i=0; i<paths.length; i++) {
            scene.remove(paths[i]);
        }
        paths = [];
    }



    // orbit controller
    var orbit_controller;
    function initOrbitController() {
        var options = {
            minDistance: config.distance.min,
            maxDistance: config.distance.max,
            onDistanceChange: function(spherical) {
                refreshLabels();
                refreshMarkers();
                refreshGrid(spherical);                        
            },
            onRotate: function(spherical) {
                refreshGrid(spherical);                        
            },            
        }
        orbit_controller = new zen3d.OrbitControls(camera, canvas, options);
        orbit_controller.enableDollying = params.orbit.zoom;
        orbit_controller.enableRotate = params.orbit.rotate;
        orbit_controller.enablePan = params.orbit.pan;
    }

    
    // run everything
    var running = false;
    initCanvas();
    init3D();
    initMaterials();
    addEarth();
    initGrid();
    addLabels();
    params.cursor && addCursor();    
    onResize();
    params.events.onMouseMove && initMouseMoveEvent();
    params.events.onMarkerChange && initMouseClickEvent();
    initOrbitController();
    function loop(count) {
        if(!running){
            return;
        }
        requestAnimationFrame(loop);
        orbit_controller.update();
        renderer.render(scene, camera);
    }
    running = true;
    loop(0);        
    
    

    // interface
    return {
        setCursor: function(point) {
            if(!params.cursor) {
                return;
            }
            if(!validate(point.lat, -90, 90)) {
                return console.error('Latituge is out of range: ', point.lat);
            }
            if(!validate(point.lng, -180, 180)) {
                return console.error('Longitude is out of range: ', point.lng);
            }            
            cursor.lat = point.lat;
            cursor.lng = point.lng;
            refreshCursor();
        },

        setOpacity: function(opacity) {
            if(!validate(opacity, 0, 1)) {
                return console.error('Opacity is out of range: ', opacity);
            }                        
            materials.earth.opacity = opacity;
        },

        setRotation: function(azimutal_angle) {
            orbit_controller.setAzimuthalAngle(azimutal_angle);
        },

        setDistance: function(d) {
            var r = config.distance.min + d * (config.distance.max - config.distance.min);
            orbit_controller.setRadius(r);
            orbit_controller.rotateSpeed = 0.25*r/config.distance.max;
        },

        addPath: addPath,

        addMarker: addMarker,

        clearPaths: clearPaths,

        addLabel: function(data) {
            addLabel(data);
            refreshLabels();
        },

        clearLabels: clearLabels,

        destroy: function() {
            if(!params.width && !params.height) {
                window.removeEventListener('resize', onResize);
            }            
            running = false;
            textRenderer.destroy();
            orbit_controller && orbit_controller.dispose();
            delete renderer;
            delete scene;
            canvas && canvas.parentNode.removeChild(canvas);
            delete canvas;
            delete materials;
            delete elements;            
        },

        resize: onResize
    }
}