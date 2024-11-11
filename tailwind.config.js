/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',  // Activa el modo JIT
	content: [
		'./src/**/*.pug',
		'./src/**/*.js',
		'./public/**/*.html',  // Ahora observa los archivos HTML en public/
		'!./node_modules/**/*',  // Excluye node_modules
		'**/*.html',
		'**/*.php',
		'**/*.js',
		'./src/**/*.scss',
		'!./node_modules/**/*',  // Excluye node_modules
	],
	theme: {
		container: {
			center: true, // Centra el contenedor
			padding: '15px',
			screens: {
			DEFAULT: '100%', // Configura el ancho del contenedor para todas las pantallas
			xl: '1600px', // Máximo ancho de 1600px para pantallas grandes
			},
		},
		extend: {
		fontFamily: {
				'sans': ['Montserrat', 'sans-serif'], 
				'cascadia': ['CascadiaCode', 'sans-serif'] 
			},
		},
		screens: {
			sm: '480px',
			m: '640px',
			l: '960px',
			lg: '1280px',
			xl: '1600px',
			xxl: '1800px',
			xxxl: '1920px',
		},
	},
	plugins: [],
};
