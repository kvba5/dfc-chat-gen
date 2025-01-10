import type { NextConfig } from "next";
import withExportImages from "next-export-optimize-images"
import CopyWebpackPlugin from "copy-webpack-plugin"

const nextConfig: () => Promise<NextConfig> = () => {
  const conf: NextConfig = {
    output: "export",
    reactStrictMode: false,
    experimental: {},
    webpack: (config) => {
      config.plugins = [
        ...config.plugins,
        new CopyWebpackPlugin({
          patterns: [{
            from: "node_modules/modern-gif/dist/worker.js",
            to: "../public/workers/modern-gif",
          }]
        })
      ]

      return config
    }
  };

  // if (phase === PHASE_PRODUCTION_BUILD) conf.experimental = {
  //   ...conf.experimental,
  //   reactCompiler: {
  //     compilationMode: "all"
  //   }
  // }
  // maybe one day...

  // github pages build
  if (process.env.BUILDMODE === "GHPAGES") {
      conf.basePath = "/dfc-chat-gen"
      conf.trailingSlash = true
  }

  return withExportImages(conf);
}

export default nextConfig;
