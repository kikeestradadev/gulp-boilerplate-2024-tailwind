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
		extend: {
			fontFamily: {
				'montserrat': ['"Montserrat"', 'sans-serif'],
			},
		},
		screens: {			
			sm: 	'480px',
			m: 		'640px',
			l: 		'960px',
			lg: 	'1280px',
			xl: 	'1600px',
			xxl: 	'1800px',
			xxxl: 	'1920px',
		},
	},
	plugins: [],
};
