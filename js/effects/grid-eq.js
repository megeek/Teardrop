EFFECTS.push({

  SCENE: null, CAMERA: null, RENDERER: null,

  FFT: 64, //should be double the width

  HEIGHT: 20,
  WIDTH: 32,
  SIZE: 18,

  EQ: [],
  
  CONTROLS: null,

  BEAT_INDICATOR: [],
  THRESHOLD_INDICATOR: [],
  VOLUME_INDICATOR: [],

  /////////////////////////////////////////////////////////////////////////////////

  setup: function() {

    document.getElementById('help').innerHTML = "<strong>grid eq</strong><br />left click and drag to rotate<br />right click and drag to pan<br />mousewheel zooms";

    this.SCENE = new THREE.Scene();

    this.RENDERER = new THREE.WebGLRenderer();
    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.RENDERER.domElement);

    this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    this.CAMERA.position.z = this.SIZE * this.WIDTH * 1.4;

    this.CONTROLS = new THREE.OrbitControls(this.CAMERA, this.RENDERER.domElement);
    
    for(var i = -this.WIDTH; i < this.WIDTH; i++) {

      this.EQ.push([]);
      
      for(var j = -this.HEIGHT / 2; j < this.HEIGHT / 2; j++) {
      
        var material = new THREE.MeshBasicMaterial({color: new THREE.Color(1 - ((j + this.HEIGHT / 2) / this.HEIGHT / 1.5), 1 - ((j + this.HEIGHT / 2) / this.HEIGHT / 1.5), 1), transparent: true, opacity: 0});
        var geometry = new THREE.BoxGeometry(this.SIZE, this.SIZE, this.SIZE);
        var mesh = new THREE.Mesh(geometry, material);

        material.blending = THREE.AdditiveBlending;

        mesh.position.x = (i * (this.SIZE * 1.35) + (this.SIZE * 1.35 / 2));
        mesh.position.y = (j * (this.SIZE * 1.35) + (this.SIZE * 1.35 / 2));

        this.SCENE.add(mesh);
        this.EQ[this.EQ.length - 1].push(mesh);

      }

    }

    for(var i = 0; i < 2; i++) {

      var mult = i == 0 ? -1 : 1;

      var b_material = new THREE.MeshBasicMaterial({color: new THREE.Color(1, 1, 1), transparent: true, opacity: 1});
      var b_geometry = new THREE.BoxGeometry(this.SIZE * 4, this.SIZE, this.SIZE);
      b_geometry.translate(((mult * this.WIDTH + (mult * 3)) * this.SIZE * 1.35), 0, 0);
      var b_mesh = new THREE.Mesh(b_geometry, b_material);
      this.SCENE.add(b_mesh);
      this.BEAT_INDICATOR.push(b_mesh);

      var t_material = new THREE.MeshBasicMaterial({color: new THREE.Color(1, 1, 1), transparent: true, opacity: .66});
      var t_geometry = new THREE.BoxGeometry(this.SIZE * 4, this.SIZE, this.SIZE);
      t_geometry.translate(((mult * this.WIDTH + (mult * 7)) * this.SIZE * 1.35), 0, 0);
      var t_mesh = new THREE.Mesh(t_geometry, t_material);
      this.SCENE.add(t_mesh);
      this.THRESHOLD_INDICATOR.push(t_mesh);

      var v_material = new THREE.MeshBasicMaterial({color: new THREE.Color(1, 1, 1), transparent: true, opacity: .33});
      var v_geometry = new THREE.BoxGeometry(this.SIZE * 4, this.SIZE, this.SIZE);
      v_geometry.translate(((mult * this.WIDTH + (mult * 11)) * this.SIZE * 1.35), 0, 0);
      var v_mesh = new THREE.Mesh(v_geometry, v_material);
      this.SCENE.add(v_mesh);
      this.VOLUME_INDICATOR.push(v_mesh);

    }

  }, //setup

  destroy: function() {

    for(var i = 0; i < this.WIDTH * 2; i++) {
      for(var j = 0; j < this.HEIGHT; j++) {
        this.SCENE.remove(this.EQ[i][j]);
      }
    }

    this.EQ = [];

    var i = 2;
    while(i--) {
      this.SCENE.remove(this.BEAT_INDICATOR.pop());
      this.SCENE.remove(this.THRESHOLD_INDICATOR.pop());
      this.SCENE.remove(this.VOLUME_INDICATOR.pop());
    }

    document.body.removeChild(this.RENDERER.domElement);

  }, //destroy

  input: function(e) {
  
  },

  tick: function() {

    this.CONTROLS.update();

    for(var i = 0; i < this.WIDTH * 2; i++) {

      for(var j = 0; j < this.HEIGHT; j++) {

        var lvl = j / this.HEIGHT;
        var mat = this.EQ[i][j].material;

        if(FD[Math.abs(i - this.WIDTH)] / 256 > lvl) {
          mat.opacity = .5;
        } else {
          mat.opacity *= .8;
          if(mat.opacity < .1) {
            mat.opacity = .1;
          }
        }

      }

      var toff = this.HEIGHT / 2 + Math.floor(this.HEIGHT * 2 * (TD[i] - 128) / 128);
      if(toff < 0) toff = 0;
      if(toff > this.HEIGHT - 1) toff = this.HEIGHT - 1;

      this.EQ[i][toff].material.opacity = 1;

    }

    for(var i = 0; i < 2; i++) {
      this.THRESHOLD_INDICATOR[i].position.y = 2 * ((this.HEIGHT * this.SIZE * (THRESHOLD / 256)) - (this.HEIGHT * this.SIZE / 4));
      this.VOLUME_INDICATOR[i].position.y = 2 * ((this.HEIGHT * this.SIZE * (VOLUME / 256)) - (this.HEIGHT * this.SIZE / 4));
    }

    this.RENDERER.render(this.SCENE, this.CAMERA);

  }, //tick

  beat: function() {

    for(var i = 0; i < 2; i++) {
      this.BEAT_INDICATOR[i].position.y = 2 * ((this.HEIGHT * this.SIZE * (VOLUME / 256)) - (this.HEIGHT * this.SIZE / 4));
    }

  }, //beat

  resize: function() {

    this.RENDERER.setSize(window.innerWidth, window.innerHeight);  

    this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    this.CAMERA.position.z = this.SIZE * this.WIDTH * 1.4;
    this.CAMERA.updateProjectionMatrix();

    this.CONTROLS = new THREE.OrbitControls(this.CAMERA, this.RENDERER.domElement);

  }
  
});
