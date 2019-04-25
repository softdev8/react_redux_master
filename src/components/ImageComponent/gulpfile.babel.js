import gulp from 'gulp';
import notify from "gulp-notify";
import gulpSequence from 'gulp-sequence';
import babel from 'babel/register';
import mocha from 'gulp-mocha';
import eslint from 'gulp-eslint';
import nightwatch from 'gulp-nightwatch';
import cliClear from 'cli-clear';
import friendlyFormatter from "eslint-friendly-formatter";
import guppy from 'git-guppy';
guppy(gulp);

const e2eDir = '../e2e/tests';
const testsDir = 'test/**/*.js';
const srcDir = 'src/**/*.js';

gulp.task('pre-commit', ['pre-commit-session']);

gulp.task('pre-commit-session', (cb) => {
  gulpSequence('test', 'e2e', cb);
});

gulp.task('lint', () => {
  return gulp.src(srcDir)
    .pipe(eslint())
    .pipe(eslint.formatEach(friendlyFormatter))
});

gulp.task('test', ()=> {
  return gulp.src(testsDir)
    .pipe(mocha({
    reporter: 'list',

    compilers: {
      js: babel,
    },
  }))
    .on('error', notify.onError({
    message: "Error: <%= error.message %>",
    title: "Error running mocha tests",
  }))
});

gulp.task('e2e', ()=> {
  return gulp.src([e2eDir])
    .pipe(nightwatch({
    configFile: '../nightwatch.json',

    cliArgs: {
      env: 'chrome',
    },
  }))
    .on('error', notify.onError({
    message: "Error: <%= error.message %>",
    title: "Error running e2e test",
  }));
});

gulp.task('cli-clear', ()=> {
  cliClear()
});

gulp.task('lint-session', (cb) => {
  gulpSequence('cli-clear', 'lint', cb);
});

gulp.task('test-session', (cb) => {
  gulpSequence('cli-clear', 'test', cb);
});

gulp.task('watch:lint', ['lint-session'], () => {
  gulp.watch([srcDir, testsDir], ['lint-session']);
});

gulp.task('watch:test', ()=> {
  gulp.watch([srcDir, testsDir], ['test-session']);
});

