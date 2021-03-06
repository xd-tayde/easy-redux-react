import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import sass from 'rollup-plugin-sass'
import serve from 'rollup-plugin-serve'
import replace from 'rollup-plugin-replace'
import globals from 'rollup-plugin-node-globals'

// 包配置
const packages = require('./package.json')
// 环境变量
const env = process.env.NODE_ENV || 'development'
// 路径配置
const paths = {
    input: env === 'example' ? './example/' : './lib/',
    dist: env === 'example' ? './example/dist/' : './dist/',
}

// 文件名
let fileName
switch (env) {
    case 'development':
        fileName = packages.name
        break
    case 'example':
        fileName = `example`
        break
    case 'es':
        fileName = `${packages.name}.es`
        break
    case 'production':
        fileName = `${packages.name}.min`
        break
}

const Config = {
    input: `${paths.input}index.tsx`,
    output: {
        file: `${paths.dist}${fileName}.js`,
        format: env === 'es' ? 'es' : 'umd',
        name: 'EasyReduxReact',
        sourcemap: true,
        globals: {
            react: 'React',
            redux: 'Redux',
            'react-dom': 'ReactDOM',
            'react-redux': 'ReactRedux',
        },
        // 连接 livereload 
        intro: env === 'example' ? `document.write('<script src="http://' + (location.host || "localhost").split(":")[0] + ':35729/livereload.js?snipver=1"></' + "script>")` : '',
    },
    external: env === 'example' ? [] : ['react', 'redux', 'react-redux'],
    plugins: [
        // babel 编译
        babel({
            exclude: 'node_modules/**', 
            babelrc: false,
            presets: [['@babel/preset-env', { modules: false }]],
            runtimeHelpers: true,
          }),
        resolve({
            extensions: [ '.ts', '.tsx', '.js', '.json', '.node' ],
            jsnext: true,
        }),
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                'node_modules/react/index.js': ['useState', 'useRef', 'useReducer', 'useContext', 'useMemo', 'Component', 'PureComponent', 'Fragment', 'Children', 'createElement', 'useLayoutEffect', 'useEffect'],
                'node_modules/react-dom/index.js': ['unstable_batchedUpdates', 'render'],
                'node_modules/react-is/index.js': ['isContextConsumer', 'isValidElementType'],
            }
        }),
        typescript(),
        sass({
            output: `${paths.dist}/main.css`,
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(env),
        }),
        // 开发时开启服务
        (env === 'example' && serve({
            contentBase: './example',
            port: 3000,
            open: true,
        })),
        (env === 'production' && uglify()),
        (env === 'production' && sourcemaps()),
        globals(),
    ],
}

export default Config
