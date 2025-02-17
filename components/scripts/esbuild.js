const glob = require('tiny-glob')
const esbuild = require('esbuild')
const watch = require('node-watch')

const isWatch = /--watch/.test(process.argv.pop())
const watcher = watch('./components/src', { recursive: true })

function build(entry) {
  const file = entry.match(/.*\/(.[^\/]*)[.](js|css)$/)

  if (
    !/components\/src\/.[^/]*.js/.test(entry) &&
    !/components\/src\/styles/.test(entry) &&
    !/components\/lib\//.test(entry)
  ) {
    return
  }

  const isCssModule = /components\/src\/styles/.test(entry)
  const isLibFile = /components\/lib\//.test(entry)

  return esbuild.build({
    entryPoints: [
      isCssModule
        ? './components/src/styles/index.css'
        : isLibFile
          ? './components/src/global.js'
          : entry,
    ],
    bundle: true,
    outfile: /components\/src\/global.js/.test(entry)
      ? `./assets/-${file[1]}.min.js`
      : `./assets/-${
          isCssModule ? 'base' : isLibFile ? 'global' : `component-${file[1]}`
        }.min.${file[2]}`,
    format: 'esm',
    minify: !isWatch,
    sourcemap: isWatch,
    plugins: [
      {
        name: 'resolve',
        setup(build) {
          build.onResolve({ filter: /lit/ }, (args) => {
            if (
              /components\/src\/.[^/]*[.]js/.test(args.importer) &&
              !/global[.]js/.test(args.importer)
            ) {
              return { path: './-global.min.js', external: true }
            }
          })
        },
      },
      {
        name: 'notifier',
        setup(build) {
          build.onEnd((result) => {
            console.log(`built with ${result.errors.length} errors`)
          })
        },
      },
    ],
  })
}

;(async function () {
  if (isWatch) {
    watcher.on('change', function (evt, name) {
      build(name)
    })
  } else {
    const files = await glob('./components/src/**/*.{js,css}')
    await Promise.all(files.map((name) => build(name)))
    process.exit(0)
  }
})()
