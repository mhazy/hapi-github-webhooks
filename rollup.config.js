import babel from 'rollup-plugin-babel';

export default {
    input: 'lib/index.js',
    external: [
        'joi',
        'boom'
    ],
    plugins: [
        babel({
            babelrc: false,
            exclude: ['./node_modules/**'],
            presets: [['env', {modules: false, targets: {node: 8}}]]
        })
    ],
    output: [
        {file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true},
        {file: 'dist/index.es.js', format: 'es', sourcemap: true}
    ]
};
