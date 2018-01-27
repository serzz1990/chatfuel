const path = require('path');
const poststylus = require('poststylus');


module.exports = {
    options: {
        stylus: {
            'sourceMap': true,
            use: [poststylus(['autoprefixer'])],
            import: [
                path.resolve(process.cwd(), 'src/assets/variables.styl'),
                path.resolve(process.cwd(), 'src/assets/mixins.styl')
            ]
        }
    }
};
