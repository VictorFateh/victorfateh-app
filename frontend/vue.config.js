module.exports = {
    // css: {
    //     loaderOptions: {
    //         sass: {
    //             prependData: `@import "~@/styles/variables.sass"`
    //         }
    //     }
    // },
    publicPath: '',  // See: https://cli.vuejs.org/config/#publicpath : "...an empty string ('') or a relative path (./) so that all assets are linked using relative paths." We will be deploying to /, /<s3bucket>, and other paths for our multiple customers.
    chainWebpack: config => {
        // add SVG inline loader (.vue)
        config.module
            .rule("vue")
            .use("vue-svg-inline-loader")
            .loader("vue-svg-inline-loader");

        // add SVG inline loader (.tsx)
        config.module
            .rule("tsx")
            .use("vue-svg-inline-loader")
            .loader("vue-svg-inline-loader");

        // config.module.rule("js").merge({exclude: "/node_modules/" });
        // config.module.rule("ts").merge({exclude: "/node_modules/" });
    }

    // pluginOptions: {
    //     s3Deploy: {
    //         registry: undefined,
    //         awsProfile: 'default',
    //         overrideEndpoint: false,
    //         endpoint: 'DigitalOcean',
    //         region: 'us-east-1',
    //         bucket: 'socotra.wb',
    //         createBucket: true,
    //         staticHosting: true,
    //         staticIndexPage: 'index.html',
    //         staticErrorPage: 'index.html',
    //         assetPath: 'dist',
    //         assetMatch: '**',
    //         deployPath: '/',
    //         acl: 'public-read',
    //         pwa: false,
    //         pwaFiles: 'index.html,service-worker.js,manifest.json',
    //         enableCloudfront: false,
    //         pluginVersion: '4.0.0-rc3',
    //         uploadConcurrency: 5
    //     }
    // }
};
