var simleShader = {
	
	camera:null,
	scene:null,
	renderer:null,
	cube:null,
	uniforms:null,
	
	v_shader: `
varying vec3 localPos;

void main() {
	localPos = position;
	vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * modelViewPosition;
}	
	`,
	
	f_shader: `
varying vec3 localPos;
uniform float time;

void main() {
	// varying values like localPos, is the vertex property of the current fragment
	// or imaging the screen pixel area of the 3d object
	float edge = 0.47;
	float scala = sin(time) * 0.5 + 0.5;
	
	if (int(abs(localPos.x) > edge) + 
		int(abs(localPos.y) > edge) + 
		int(abs(localPos.z) > edge) >= 2) {
		gl_FragColor = vec4(scala, scala, 1.0, 1.0);
	}
	else {
		gl_FragColor = vec4(localPos.x + 0.5, localPos.y + 0.5, localPos.z + 0.5, 1.0);
	}
}	
	`,
	
	init: function () {
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
		this.camera.position.z = 4;

		this.scene = new THREE.Scene();

		geometry = new THREE.BoxGeometry( 1, 1, 1 );
		
		this.uniforms = {
			time: { type: "f", value: 1.0 }
		}
		material = new THREE.ShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader: this.v_shader,
			fragmentShader: this.f_shader
		});
		
		this.cube = new THREE.Mesh( geometry, material );
		this.scene.add( this.cube );
		
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		
		this.animate = this.animate.bind(this); // don't forgot this line, otherwise it will lose reference of 'this' when being callbacked.
		this.animate();
	},
	
	animate: function () {
		requestAnimationFrame( this.animate );

		this.cube.rotation.x += 0.01;
		this.cube.rotation.y += 0.02;
		
		this.uniforms.time.value += 0.1;

		this.renderer.render( this.scene, this.camera );
	}
};