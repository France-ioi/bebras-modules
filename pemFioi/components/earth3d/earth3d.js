function Earth3D(params, onLoad) { 


    function validate(value, min, max) {
        return value >= min && value <= max;
    }

    var defaults = {
        camera: {
            lat: 0,
            lng: 0
        },
        cursor: {
            lat: 0,
            lng: 0
        },
        target: {
            lat: 0,
            lng: 0
        },
        texture: 'resources/earth4.jpg',
        opacity: 1,
        tesselation: 100,
        parent: document.body
    }
    var params = Object.assign({}, defaults, params);
    if(!validate(params.camera.lat, -90, 90)) {
        return console.error('Camera lat is out of range: ', params.camera.lat);
    }                        
    if(!validate(params.camera.lng, -180, 180)) {
        return console.error('Camera lng is out of range: ', params.camera.lng);
    }                        
    if(!validate(params.cursor.lat, -90, 90)) {
        return console.error('Cursor lat is out of range: ', params.cursor.lat);
    }                        
    if(!validate(params.cursor.lng, -180, 180)) {
        return console.error('Cursor lng is out of range: ', params.cursor.lng);
    }
    if(!validate(params.target.lat, -90, 90)) {
        return console.error('Target lat is out of range: ', params.target.lat);
    }                        
    if(!validate(params.target.lng, -180, 180)) {
        return console.error('Target lng is out of range: ', params.target.lng);
    }
    if(!validate(params.opacity, 0, 1)) {
        return console.error('Opacity is out of range: ', params.opacity);
    }    
    if(!validate(params.tesselation, 10, 1000)) {
        return console.error('Tesselation is out of range: ', params.tesselation);
    }        

    var cursor = Object.assign({}, params.cursor);

    var materialMaker = {


        // texture: function(url) {
        texture: function(image) {
            //var texture = zen3d.Texture2D.fromSrc(url);
            var texture = zen3d.Texture2D.fromImage(image);
            texture.encoding = zen3d.TEXEL_ENCODING_TYPE.LINEAR;
            mat = new zen3d.LambertMaterial();
            mat.diffuse.setHex(0xffffff);
            mat.diffuseMap = texture;
            mat.transparent = true;
            mat.opacity = params.opacity;
            mat.premultipliedAlpha = true;        
            return mat;
        },

        color: function(color) {
	        var mat = new zen3d.LambertMaterial();
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

        line: function(color, loop) {
            var mat = new zen3d.LineMaterial();
            mat.diffuse.setHex(color);
            if(loop) {
                mat.drawMode = zen3d.DRAW_MODE.LINES;
            }
            return mat;
        },

        dots: function(color, size) {
            var mat = new zen3d.PointsMaterial();
            mat.acceptLight = false;
            mat.size = size;
            mat.diffuse.setHex(color);
            return mat;
        }
    }



    var canvas;
    var renderer;
    var scene;
    var materials;


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
        var pos = llToPos(params.camera.lat, params.camera.lng, 20);
        camera.position.set(pos.x, pos.y, pos.z);
        camera.lookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
        scene.add(camera);
    }


    function initMaterials(image) {
        materials = {
            pole: materialMaker.color(0x000000),
            earth: materialMaker.texture(image),
            greenwich: materialMaker.dots(0xFFFF00, 0.5),
            lng: materialMaker.dots(0xFFFF00, 0.15),
            lng_angle: materialMaker.triangles(0xFFFF00),
            equator: materialMaker.dots(0x00FF00, 0.5),
            lat: materialMaker.dots(0x00FF00, 0.15),
            lat_angle: materialMaker.triangles(0x00FF00),
            line: materialMaker.line(0x0000FF),
            point: materialMaker.color(0xFF0000),
            target: materialMaker.color(0x00FFFF),
        }
    }    


    function initEarth() {
        var earth_geo = new zen3d.SphereGeometry(1, params.tesselation, params.tesselation);
        var earth = new zen3d.Mesh(earth_geo, materials.earth);
        earth.euler.y = - Math.PI * 0.5;
        scene.add(earth);

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

        var target_geo = new zen3d.SphereGeometry(0.041, params.tesselation / 5, params.tesselation / 5);
        var target = new zen3d.Mesh(target_geo, materials.target);        
        var pos = llToPos(params.target.lat, params.target.lng);
        target.position.set(pos.x, pos.y, pos.z);
        scene.add(target);        
    }




    var controls = {}

    function initControls() {
        function mesh(vertices, material) {
            var geo = new zen3d.Geometry();
            var buffer = new zen3d.InterleavedBuffer(new Float32Array(vertices), 3, 0);
            geo.addAttribute('a_Position', new zen3d.InterleavedBufferAttribute(buffer));
            geo.computeBoundingBox();
            geo.computeBoundingSphere();
            var m = new zen3d.Mesh(geo, material);
            scene.add(m);                    
            return m;
        }

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
        controls.lat = mesh(lat_vertices, materials.lat);

        // cursor lng
        controls.lng = mesh(lng_vertices, materials.lng);

        var t = params.tesselation * 0.5;        
        
        // cursor angles
        var angle_vertices = [0,0,0];
        for(var i=0; i<=t; i++) {
            angle_vertices.push(0,0,0);
        }
        controls.lat_angle = mesh(angle_vertices, materials.lat_angle);
        controls.lng_angle = mesh(angle_vertices, materials.lng_angle);

        // cursor lines
        var vertices = [0,0,0,0,0,1];
        controls.line_zero = mesh(vertices, materials.line);
        controls.line_lat = mesh(vertices, materials.line);
        controls.line_lng = mesh(vertices, materials.line);        

        // cursor point
        var point = new zen3d.SphereGeometry(0.041, params.tesselation / 5, params.tesselation / 5);
        controls.point = new zen3d.Mesh(point, materials.point);        
        scene.add(controls.point);                
    }


    
    // controls

    function llToPos(lat, lng, r) {
        r = r || 1;
        lat = lat * Math.PI / 180;
        lng = lng * Math.PI / 180;
        return {
            x: r * Math.cos(lat) * Math.sin(lng),
            y: r * Math.sin(lat),
            z: r * Math.cos(lat) * Math.cos(lng)
        }
    }


    function refreshControls() {
        var lng_line_pos = llToPos(0, cursor.lng);
        with(controls.line_lng.geometry.attributes.a_Position) {
            data.array[3] = lng_line_pos.x;
            data.array[5] = lng_line_pos.z;
            data.version++;
        }

        var cursor_pos = llToPos(cursor.lat, cursor.lng);
        with(controls.line_lat.geometry.attributes.a_Position) {
            data.array[3] = cursor_pos.x;
            data.array[4] = cursor_pos.y;
            data.array[5] = cursor_pos.z;
            data.version++;        
        }

        with(controls.point.position) {
            x = cursor_pos.x;
            y = cursor_pos.y;
            z = cursor_pos.z;
        }

        controls.lng.euler.y = cursor.lng / 180 * Math.PI;

        var lat_line_pos = llToPos(cursor.lat, 0);
        controls.lat.position.y = cursor_pos.y;
        controls.lat.scale.x = lat_line_pos.z;
        controls.lat.scale.z = lat_line_pos.z;


        
        var t = params.tesselation * 0.5;        

        // cursor angle lat
        controls.lat_angle.euler.y = cursor.lng / 180 * Math.PI;
        var lat_angle_start = Math.min(0, cursor.lat / 180 * Math.PI);
        var lat_angle = Math.max(0, cursor.lat / 180 * Math.PI) - lat_angle_start;
        with(controls.lat_angle.geometry.attributes.a_Position) {
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
        with(controls.lng_angle.geometry.attributes.a_Position) {
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
        var width = params.parent.offsetWidth || 2;
        var height = params.parent.offsetHeight || 2;        
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        camera.setPerspective(0.035 * Math.PI, width / height, 1, 1000);
        renderer.backRenderTarget.resize(width, height);
    }
    window.addEventListener('resize', onResize, false);

  

    // load texture and run
    var image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = function() {
        initCanvas();
        init3D();
        initMaterials(image);
        initEarth();
        initControls();    
        onResize();
        var controller = new zen3d.OrbitControls(camera, canvas);
        function loop(count) {
            requestAnimationFrame(loop);
            controller.update();
            renderer.render(scene, camera);
        }
        loop(0);        
        onLoad();
    }
    image.src = 'data:image/jpeg;base64,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';
    
    

    // interface
    return {
        setCursor: function(lat, lng) {
            if(!validate(lat, -90, 90)) {
                return console.error('Latituge is out of range: ', lat);
            }
            if(!validate(lng, -180, 180)) {
                return console.error('Longitude is out of range: ', lng);
            }            
            cursor.lat = lat;
            cursor.lng = lng;
            refreshControls();
        },

        setOpacity: function(opacity) {
            if(!validate(opacity, 0, 1)) {
                return console.error('Opacity is out of range: ', opacity);
            }                        
            materials.earth.opacity = opacity;
        }
    }
}