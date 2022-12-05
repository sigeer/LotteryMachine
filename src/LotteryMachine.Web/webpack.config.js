"use strict";

// Libs
const fs = require("fs");
const path = require("path");
const sass = require("sass");

//Configs
const staticRoot = __dirname + "/wwwroot";

//Entry
const scssEntries = [
    "main"
];

const {
    VueLoaderPlugin
} = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


//返回完整路径
const getAbsolutePath = function () {
    const paths = Array.from(arguments).map(x => path.resolve(staticRoot, x));

    return paths.length === 1 ? paths[0] : paths;
};

const getFilesInFolder = (folder, filter) => fs.readdirSync(folder).filter(x => filter ? filter(x) : true);

//const copyFileContent = (output, fileName, folder) => {
//    const filePath = folder ? path.resolve(folder, fileName) : fileName;
//    let content = fs.readFileSync(filePath, "utf8") || "";

//    // Remove BOM character from Windows
//    if (content.charCodeAt(0) === 0xFEFF) {
//        content = content.substr(1);
//    }

//    fs.appendFileSync(output, `${content.trim()}\n`, { encoding: "utf8" });
//};

const compileScss = function (entry, target, outputDir) {
    try {
        let entryFile = path.resolve(staticRoot, `styles/${entry}.scss`);
        let targetForceFile = path.resolve(staticRoot, `styles/${entry}.${target}.scss`);

        if (fs.existsSync(targetForceFile)) entryFile = targetForceFile;

        console.log(`Compiling ${setColor(entryFile)}`);

        let result = sass.renderSync({
            file: entryFile,
            outputStyle: "compressed"
        });

        const outputFile = `${entry}.min.css`;
        console.log(`compiled: ${setColor(outputFile)}, to ${setColor(outputDir, fgColors.yellow)}`);

        fs.writeFile(path.resolve(outputDir, outputFile),
            result.css,
            fsErr => fsErr && console.error(fsErr));
    } catch (err) {
        console.log(err);
    }
    console.log("");
}

const fgColors = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
};

const setColor = (txt, fgColor) => `${(fgColor || fgColors.cyan)}${txt}\x1b[0m`;

const camelCaseToDash =
    (str) => str.replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '-' : '') + match.toLowerCase());

//生成entry文件
const genVueEntryFile = (model) => {
    if (!model.folders)
        return;

    var imports = [];
    var links = [];

    model.folders
        .forEach(folder => {
            let rel = folder.replace(model.basePath, ".");

            let dir = getAbsolutePath(folder);

            if (!fs.existsSync(dir)) {
                return;
            }

            getFilesInFolder(dir, i => (/\.(vue)$/).test(i))
                .forEach(fn => {
                    var extension = path.extname(fn);
                    var fileName = path.basename(fn, extension);

                    imports.push(`import ${fileName} from "${rel}/${fileName}${extension}"`);
                    links.push(`app.component("${camelCaseToDash(fileName)}", ${fileName});`);
                });
        });

    imports.sort((a, b) => a.localeCompare(b));
    links.sort((a, b) => a.localeCompare(b));

    var content = `${imports.join("\n")}

export default {
    install: (app, options) => {
        ${links.join("\n")}
    }
}`;

    fs.writeFileSync(getAbsolutePath(model.entryFile), content, (err) => {
        if (err) return console.log(err);
    });
}

const compileVue = (item, outputDir) => {
    let config = {
        target: ["web", "es6"],
        mode: process.env.NODE_ENV || "development",

        output: {
            path: getAbsolutePath(outputDir),
            filename: "[name].min.js",
            environment: {
                arrowFunction: false,
                const: false
            }
        },

        resolve: {
            extensions: ['\*', '.js', '.vue'],
            symlinks: false,
            alias: {
                "@": path.resolve(__dirname, '../src'),
                'vue$': 'vue/dist/vue.esm-bundler.js',
                vue: path.resolve(__dirname, "../node_modules/vue")
            }
        },

        externals: {
            vue: "Vue"
        },

        optimization: {
            minimize: true
        },

        plugins: [
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: "../css/[name].min.css"
            })
        ],

        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: [
                        {
                            loader: "vue-loader",
                            options: {
                                compilerOptions: {
                                    whitespace: "preserve"
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(sc|sa|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: "css-loader",
                            options: {
                                url: false
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    ident: "postcss",
                                    plugins: [require("autoprefixer")()]
                                }
                            }
                        },
                        "sass-loader"
                    ]
                },
                {
                    test: /.\js$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@vue/cli-plugin-babel/preset"
                            ]
                        }
                    },
                    exclude: /node_modules/
                }
            ]
        },

        performance: {
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },

        watchOptions: {
            aggregateTimeout: 600
        }
    };

    //.vue -> entry.js
    genVueEntryFile(item);

    config.name = item.name;

    config.entry = {};
    config.entry[item.name] = typeof item.entryFile === "string" ? getAbsolutePath(item.entryFile) : item.entryFile.map(e => getAbsolutePath(e));

    if (item.libName || item.isLib) {
        config.output.library = {
            name: item.libName,
            type: "umd",
            export: item.isLib ? undefined : "default"
        };
    }

    return config;
}

module.exports = env => {
    const target = env.target;

    const distFolder = "dist";

    const distJsFolder = distFolder + "/js";
    const distCssFolder = distFolder + "/css";

    //Compile SCSS files Start
    console.log(setColor("Compile SCSS", fgColors.green));

    scssEntries.forEach(x =>
        compileScss(x,
            target,
            getAbsolutePath(distCssFolder)
        )
    );
    //Compile SCSS files End

    const newConfigs = [
        {
            libName: 'Component',
            name: "components",
            entryFile: "js/vue_components/vue_component.entry.js",
            basePath: "js/vue_components",
            folders: [
                "js/vue_components"
            ]
        },
        {
            libName: 'Page',
            name: "pages",
            entryFile: "js/vue_pages/vue_page.entry.js",
            basePath: "js/vue_pages",
            folders: [
                "js/vue_pages"
            ]
        }
    ]
        .map(x => compileVue(x, distJsFolder));

    return newConfigs;
}
