import { Regl, Texture } from "regl"

export default function(regl: Regl, texture: Texture) {
    return regl({
      primitive: 'triangles',
      vert: `
        precision mediump float;
        attribute vec2 position;
        varying vec2 uv;
        void main() {
          uv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0, 1);
        }
      `,
      
      frag: `
        precision mediump float;
        varying vec2 uv;
        uniform sampler2D texture;

        uniform vec2 resolution;
        float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

        void main(){
            vec4 color=vec4(0.0);
            vec2 center= resolution / 2.0;
            float strength = 0.1;
            float total=0.0;
            vec2 toCenter=center-uv*resolution;
            float offset=random(vec3(12.9898,78.233,151.7182),0.0);
            for(float t=0.0;t<=40.0;t++){
                float percent=(t+offset)/40.0;
                float weight=4.0*(percent-percent*percent);
                vec4 sample=texture2D(texture,uv+toCenter*percent*strength/resolution);
                sample.rgb*=sample.a;
                color+=sample*weight;
                total+=weight;
            }
            gl_FragColor=color/total;
            color += texture2D(texture, uv);
            gl_FragColor.rgb/=gl_FragColor.a+0.00001;
        }
      `,
      
      depth: {
        enable: false,
      },

      uniforms: {
          texture: texture,
          resolution: regl.prop("resolution")
      },
  
      attributes: {
        position: [[-1, -1], [-1, 1], [1, 1], [-1, -1], [1, 1], [1, -1]]
      },
  
      count: 6
    })
  }