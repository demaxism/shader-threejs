var extPhongShader = {
	
	camera:null,
	scene:null,
	renderer:null,
	cube:null,
	uniforms:null,
	
	phong_f_shader: `
#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
uniform float time;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	
	diffuseColor += vec4(sin(time) * 0.5, 0, 0, 0);
	
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	// accumulation
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	// modulation
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}
`,
	
	init: function () {
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
		this.camera.position.z = 4;

		this.scene = new THREE.Scene();
		
		var light = new THREE.DirectionalLight( 0xffffff, 0.6 );
		light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
		
		var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
		this.scene.add( ambientLight );

		geometry = new THREE.BoxGeometry( 1, 1, 1 );
		
		var phongShader = THREE.ShaderLib.phong;
		this.uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
		this.uniforms.time = { type: "f", value: 1.0 };
	
		var material = new THREE.ShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader: phongShader.vertexShader,
			fragmentShader: this.phong_f_shader,
			lights: true // will pass light to uniforms
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