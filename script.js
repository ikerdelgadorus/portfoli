let keyboard_count = 0;
const screen_view = [
	"BlockScreen_0.glb",
	"BlockScreen_1.glb",
	"BlockScreen_2.glb",
	"BlockScreen_3.glb",
	"BlockScreen_4.glb",
	"BlockScreen_5.glb",
	"BlockScreen_6.glb",
	"BlockScreen_7.glb",
	"BlockScreen_8.glb",
	"BlockScreen_9.glb",
	"BlockScreen_10.glb",
	"BlockScreen_11.glb",
];

AFRAME.registerComponent('revelar-retol', {
	schema: {
		target: { type: 'selector' },  
		factor: { type: 'number', default: 1.05 }
	},
	init: function () {
		const targetEl = this.data.target;
		const el = this.el;
	
		// Guardem l'escala original de l'objecte
		this.escalaOriginal = Object.assign({}, el.getAttribute('scale'));


		// Quan el ratolí ENTRA a l'objecte
		el.addEventListener('mouseenter', () => {
		// 1. Mostrem el rètol associat
		if (targetEl) targetEl.setAttribute('visible', 'true');


		// 2. Augmentem la mida de l'objecte
		const orig = this.escalaOriginal;
		const f = this.data.factor;
		//el.setAttribute('scale', `${orig.x * 0.9} ${orig.y * 1.1} ${orig.z * 0.9}`);
		//el.pause();
		});


		// Quan el ratolí SURT de l'objecte
		el.addEventListener('mouseleave', () => {
		// 1. Amaguem el rètol
		if (targetEl) targetEl.setAttribute('visible', 'false');


		// 2. Restablim l'escala original
		const orig = this.escalaOriginal;
		el.setAttribute('scale', `${orig.x} ${orig.y} ${orig.z}`);
		//el.play();
    	});
  	}
});

AFRAME.registerComponent('obrir-link', {
  		schema: {
    	url: { type: 'string' } // La URL de la pàgina web
  	},
  	init: function () {
    	const data = this.data;


    this.el.addEventListener('click', () => {
      	if (data.url) {
			// Obre la URL en una pestanya nova del navegador
			window.open(data.url, '_blank');
      	}
    });
  }
});

AFRAME.registerComponent('enviar-mail', {
	schema: {
		email: { type: 'string' },
		subject: {
			type: 'string',
			default: 'Consulta des del Portafolis 3D'
		}
	},


	init: function () {
		const data = this.data;


		this.el.addEventListener('click', () => {
			if (data.email) {
				window.location.href =
					`mailto:${data.email}?subject=${encodeURIComponent(data.subject)}`;
			}
		});
	}
});


AFRAME.registerComponent('camera-limitada', {
    schema: {
        angle: {
            type: 'number',
            default: 30
        },

        distancia: {
            type: 'number',
            default: 1.5
        }
    },


	init: function () {
		// Desa la posició inicial de la càmera
		this.posicioInicial =
			this.el.object3D.position.clone();


		// Desa la rotació inicial
		const rotacioInicial =
			this.el.getAttribute('rotation');


		this.rotacioXInicial = rotacioInicial.x;
		this.rotacioYInicial = rotacioInicial.y;
	},


	tick: function () {
		const angle = this.data.angle;


		// ---------------------------------
		// LIMITAR LA ROTACIÓ DE LA CÀMERA
		// ---------------------------------
		const rotacio = this.el.getAttribute('rotation');


		const minX = this.rotacioXInicial - angle;
		const maxX = this.rotacioXInicial + angle;


		const minY = this.rotacioYInicial - angle;
		const maxY = this.rotacioYInicial + angle;


		const xLimitat = Math.max(
			minX,
			Math.min(maxX, rotacio.x)
		);


		const yLimitat = Math.max(
			minY,
			Math.min(maxY, rotacio.y)
		);


		// Només actualitza la rotació si supera els límits
		if (
			Math.abs(rotacio.x - xLimitat) > 0.01 ||
			Math.abs(rotacio.y - yLimitat) > 0.01
		) {
			this.el.setAttribute('rotation', {
				x: xLimitat,
				y: yLimitat,
				z: rotacio.z
			});
		}


		// ---------------------------------
		// LIMITAR EL DESPLAÇAMENT
		// ---------------------------------
		const posicio = this.el.object3D.position;
		const inicial = this.posicioInicial;


		const dx = posicio.x - inicial.x;
		const dy = posicio.y - inicial.y;
		const dz = posicio.z - inicial.z;


		const distanciaActual = Math.sqrt(
			dx * dx + dy * dy + dz * dz
		);


		const distanciaMaxima = this.data.distancia;


		// Si supera 1,5 metres, retorna-la al límit
		if (distanciaActual > distanciaMaxima) {
			const factor =
				distanciaMaxima / distanciaActual;


			posicio.x = inicial.x + dx * factor;
			posicio.y = inicial.y + dy * factor;
			posicio.z = inicial.z + dz * factor;
		}
	}
});


AFRAME.registerComponent('hover-open-close', {
    schema: {
        target: { type: 'selector' },
        openClip: { default: 'Open' },
        closeClip: { default: 'Close' }
    },

    init: function () {
        this.onEnter = () => {
            console.log('ENTER: Open');
            this.playClip(this.data.openClip);
        };

        this.onLeave = () => {
            console.log('LEAVE: Close');
            this.playClip(this.data.closeClip);
        };

        this.el.addEventListener('mouseenter', this.onEnter);
        this.el.addEventListener('mouseleave', this.onLeave);
    },

    playClip: function (clipName) {
        const target = this.data.target;

        if (!target || !target.components['animation-mixer']) {
            console.warn('No se encuentra el modelo o su animation-mixer');
            return;
        }

        target.setAttribute('animation-mixer', {
            clip: clipName,
            loop: 'once',
            clampWhenFinished: true,
            repetitions: 1,
            timeScale: 1
        });
    },

    remove: function () {
        this.el.removeEventListener('mouseenter', this.onEnter);
        this.el.removeEventListener('mouseleave', this.onLeave);
    }
});

AFRAME.registerComponent('obrir-modal-aboutme', {
	init: function () {
		this.el.addEventListener('click', () => {
			const modal =
				document.getElementById('modal-aboutme');


			if (modal) {
				modal.style.display = 'flex';
			}
		});
	}
});

AFRAME.registerComponent('obrir-modal-video', {
	init: function () {
		this.el.addEventListener('click', () => {
			const modal = document.getElementById('modal-video');
			const video = document.getElementById('meuVideo');


			if (modal) {
				modal.style.display = 'flex';


				if (video) {
					video.play();
				}
			}
		});
	}
});

AFRAME.registerComponent('focus-rig', {
  init: function () {
    this.home = null;
    this.focused = false;
    this.rotated = false;
    this.cam = this.el.querySelector('[camera]');
    this.btn = document.querySelector('#modal-back');
	this.screen = document.getElementById('screen');
    this.btn.querySelector("button").addEventListener('click', () => {this.goHome(); new Audio('media/sound/click.mp3').play();});
  },

  goTo: function (pos, rot) {
    var o = this.el.object3D;
    if (!this.focused) {
      this.home = {
        pos: { x: o.position.x, y: o.position.y, z: o.position.z },
        rot: {
          x: THREE.MathUtils.radToDeg(o.rotation.x),
          y: THREE.MathUtils.radToDeg(o.rotation.y),
          z: THREE.MathUtils.radToDeg(o.rotation.z)
        }
      };
    }
    this.focused = true;
	setTimeout(() => { this.btn.style.display = 'flex'; }, 1500)
	this.screen.setAttribute("gltf-model", `models/Screen_Main.glb`);
	keyboard_count = 0;

    var c = this.cam.object3D.position;
    this.animate('position', { x: pos.x - c.x, y: pos.y - c.y, z: pos.z - c.z }, 'move');

    if (rot) {
      this.rotated = true;
      this.animate('rotation', rot, 'turn');
    }
  },

  goHome: function () {

    this.focused = false;
    this.btn.style.display = 'none';
    this.animate('position', this.home.pos, 'move');
    if (this.rotated) {
      this.rotated = false;
      this.animate('rotation', this.home.rot, 'turn');
    }
  },

  animate: function (prop, v, name) {
    var attr = 'animation__' + name;
    this.el.removeAttribute(attr);
    this.el.setAttribute(attr, {
      property: prop, to: v.x + ' ' + v.y + ' ' + v.z,
      dur: 1200, easing: 'easeInOutCubic'
    });
  }
});

AFRAME.registerComponent('focus-target', {
  schema: {
    position: { type: 'vec3' },        // dónde queda la cámara (mundo)
    rotation: { type: 'string' }       // opcional, "x y z" en grados; vacío = no tocar
  },
  init: function () {
    this.el.addEventListener('click', () => {
      var rig = document.querySelector('#rig');
      var rot = this.data.rotation.trim()
        ? AFRAME.utils.coordinates.parse(this.data.rotation)
        : null;                          // null = conservar la rotación actual
      rig.components['focus-rig'].goTo(this.data.position, rot);
    });
  }
});

AFRAME.registerComponent('keyboard-click', {
  init: function () {
    this.el.addEventListener('click', () => {
      const screen = document.getElementById('screen');
	  keyboard_count += 1;
	  screen.setAttribute("gltf-model", `models/${screen_view[(keyboard_count % screen_view.length)]}`);
    });
  }
});

function changeImg(obj, img) {
	obj.src = img;
}

function obrirModal(modalname) {
	const modal = document.getElementById(modalname);

	if (modal) {
		modal.style.display = 'block';
		new Audio('media/sound/click.mp3').play();
	}
}

function tancarModal(modalname) {
	const modal = document.getElementById(modalname);

	if (modal) {
		modal.style.display = 'none';
		new Audio('media/sound/click.mp3').play();
	}
}

function nothing(event) {
	event.stopPropagation();
}

function clickSound() {
	new Audio('media/sound/click.mp3').play();
}

function activeSound() {
    var ctx = THREE.AudioContext.getContext();

  function arrancar() {
    // Arranca los sonidos que deben sonar solos (autoplay / ambiente)
    document.querySelectorAll('[sound]').forEach(function (el) {
		var s = el.components.sound;
		if (s && s.data.autoplay) {
			s.stopSound();   // reinicia por si ya estaba "sonando" en silencio
			s.playSound();   // si el audio aún no ha cargado, empezará al terminar de cargar
		}
		});
	}

	if (ctx.state === 'suspended') {
		ctx.resume().then(arrancar, arrancar);
	} else {
		arrancar();
	}
	const modal = document.getElementById('start');
	if (modal) {
		modal.style.display = 'none';
	}
}