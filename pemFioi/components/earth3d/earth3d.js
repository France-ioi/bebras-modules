function Earth3D(params) { 


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

        texture: function(url) {
            var texture = zen3d.Texture2D.fromSrc(url);
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



    var materials = {
        pole: materialMaker.color(0x000000),
        earth: materialMaker.texture('resources/earth4.jpg'),
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
   

    var canvas;
    var renderer;
    var scene;


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


    // main
    initCanvas();
    init3D();
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