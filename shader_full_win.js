var fullWindowShader = {
	
	camera:null,
	scene:null,
	renderer:null,
	mesh:null,
	uniforms:null,
	
	v_shader: `
varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4( position, 1.0 );
}	
	`,
	
	f_shader: [
	`
		varying vec2 vUv;
		uniform float time;

		void main() {
			gl_FragColor = vec4(0, vUv.y, 0, 1.0);
		}
	`,
	`
		uniform float time;
		varying vec2 vUv;
		void main( void ) {
			vec2 position = - 1.0 + 2.0 * vUv;
			float red = abs( sin( position.x * position.y + time / 5.0 ) );
			float green = abs( sin( position.x * position.y + time / 4.0 ) );
			float blue = abs( sin( position.x * position.y + time / 3.0 ) );
			gl_FragColor = vec4( red, green, blue, 1.0 );
		}
	`,
	`
		uniform float time;
		varying vec2 vUv;
		void main( void ) {
			vec2 position = vUv;
			float color = 0.0;
			color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
			color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
			color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
			color *= sin( time / 10.0 ) * 0.5;
			gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
		}
	`
	],
	
	init: function (index) {
		this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1000 );
		this.camera.position.z = 4;

		this.scene = new THREE.Scene();

		geometry = new THREE.PlaneBufferGeometry( 2, 2 );
		
		this.uniforms = {
			time: { type: "f", value: 1.0 }
		}
		material = new THREE.ShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader: this.v_shader,
			fragmentShader: this.f_shader[index]
		});
		
		this.mesh = new THREE.Mesh( geometry, material );
		this.scene.add( this.mesh );
		
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		document.body.appendChild( this.renderer.domElement );
		
		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
		this.onWindowResize();

		this.animate = this.animate.bind(this);
		this.animate();
	},
	
	onWindowResize: function () {
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	},
	
	animate: function () {
		requestAnimationFrame( this.animate );
		
		this.uniforms.time.value += 0.1;

		this.renderer.render( this.scene, this.camera );
	}
};