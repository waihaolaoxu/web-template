// generated on 2018-05-14 using generator-webapp 3.0.1
// 自动化前端工程

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

let dev = true;

const config = {
  //第三方代码
  vendor: [
    'app/vendor/jquery/jquery.js',
    'app/vendor/jquery/jquery.cookie.js',
    'app/vendor/jquery/jquery.validate.js',
    'app/vendor/swiper/swiper-2.7.6.js'
  ],
  vendor_css: [
    'app/vendor/swiper/swiper-2.7.6.css'
  ],
  
  //压缩配置
  uglify: {
    compress: {
        drop_console: true
    },
    ie8: true,
    output: {
        keep_quoted_props: true,
        quote_style: 3
    }
  },
}

gulp.task('styles', () => {
  gulp.src(config.vendor_css)
    .pipe($.concat('vendor.css'))
    .pipe($.if(dev, gulp.dest('.tmp/styles'), gulp.dest('dist/styles'))) //连接第三方css

  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'compressed', //'expanded'
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe($.if(dev, gulp.dest('.tmp/styles'), gulp.dest('dist/styles')))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe($.if(!dev, $.uglify(config.uglify)))
    .pipe($.if(dev, gulp.dest('.tmp/scripts'), gulp.dest('dist/scripts')))
    .pipe(reload({stream: true}));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    // .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    // .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    // .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.fileInclude({
        prefix: '@@',
        basepath: './app/htmlBlocks/',
        context: {

        }
    }))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: false, //压缩html
        minifyCSS: true, //压缩页面CSS
        // minifyJS: { compress: { drop_console: true } }, //压缩页面JS
        processConditionalComments: true, //
        removeComments: true, //清除HTML注释
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true //删除<style>和<link>的type="text/css"
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('html1', () => {
    return gulp.src('app/*.html')
        .pipe($.fileInclude({
            prefix: '@@',
            basepath: './app/htmlBlocks/',
            context: {

            }
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/htmlBlocks',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp']));

gulp.task('vendorJs', () => {
  return gulp.src(config.vendor)
    .pipe($.concat('vendor.js'))
    .pipe($.plumber())
    // .pipe($.babel())
    .pipe($.uglify(config.uglify))
    .pipe($.if(dev,gulp.dest('.tmp/scripts'),gulp.dest('dist/scripts')))
});

gulp.task('serve', () => {
  runSequence(['clean'], ['styles', 'scripts', 'fonts', 'html1','vendorJs'], () => {
    browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'app'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      'app/*.html',
      'app/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', function(){
        setTimeout(reload,200)
    });

    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['fonts']);
    gulp.watch(['app/*.html', 'app/htmlBlocks/**/*.html'], ['html1']);
  });
});

gulp.task('serve:dist', ['default'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});


//整体打包
gulp.task('build-start', ['vendorJs','html', 'images', 'fonts', 'extras'], () => {
  gulp.src('app/scripts/layer/**/*').pipe(gulp.dest('dist/scripts/layer'))
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});
gulp.task('build', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['clean'], 'build-start', resolve);
  });
});


// 帮助
gulp.task('default', () => {
  console.log(`gulp build            整体打包`);
  console.log(`gulp serve            启动开发服务`);
  console.log(`gulp serve:dist       启动dist目录服务`);
  console.log(`gulp css              单独编译scss`);
  console.log(`gulp js               单独编译main.js`);
  console.log(`gulp vjs              单独编译vendor.js`);
});


// css、js 编译
gulp.task('css', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['styles'], resolve);
  });
});
gulp.task('js', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['scripts'], resolve);
  });
});
gulp.task('vjs', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['vendorJs'], resolve);
  });
});
