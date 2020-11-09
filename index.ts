/* eslint-disable @typescript-eslint/no-var-requires */
import { Compiler, Compilation } from 'webpack';
import { RawSource } from 'webpack-sources';

interface InjectAssetsListPluginOption {
  name?: string;
  allowPattern?: RegExp;
  ignorePattern?: RegExp;
}

class InjectAssetsListPlugin {
  private static __NAME = 'InjectAssetsListPlugin';
  private static DEFAULT_OPTIONS = {
    name: '__assets',
    allowPattern: undefined,
    ignorePattern: undefined,
  };

  constructor(
    private options: InjectAssetsListPluginOption = InjectAssetsListPlugin.DEFAULT_OPTIONS,
  ) {}

  /**
   * Generate script tag with assets list variable.
   * @param assets Assets list
   */
  private getInjectScript(assets: string[]): string {
    return `<script type="text/javascript">var ${this.options.name}=${JSON.stringify(
      assets,
    )};</script>`;
  }

  apply(compiler: Compiler) {
    const { allowPattern, ignorePattern } = this.options;
    const publicPath = compiler.options.output.publicPath;

    compiler.hooks.compilation.tap(InjectAssetsListPlugin.__NAME, (compilation: Compilation) => {
      /* HtmlWebpackPlugin hook */
      (compilation.hooks as any).htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
        InjectAssetsListPlugin.__NAME,
        (data: any, cb: Function) => {
          const assets = compilation
            .getAssets()
            .filter(({ source }) => source instanceof RawSource) // Only webpack RawSource
            .filter(({ name }) => (ignorePattern ? !name.match(ignorePattern) : true)) // Ignore pattern filtering
            .filter(({ name }) => (allowPattern ? name.match(allowPattern) : true)) // Allow pattern filtering
            .map(({ name }) => publicPath + name);

          // Find head tag index
          const headEndIndex = data.html.indexOf('</head>') - 1;
          if (~headEndIndex) {
            const updatedHTML = String.prototype.concat.call(
              data.html.substring(0, headEndIndex),
              // Inject script tag with assets list
              this.getInjectScript(assets),
              data.html.substr(headEndIndex),
            );
            data.html = updatedHTML;
          }

          cb(null, data);
        },
      );
    });
  }
}

export default InjectAssetsListPlugin;
