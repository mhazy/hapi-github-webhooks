# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 2.0 - 2018-02-14

* Updated to work with Hapi v17 (Thanks travi!)
* Rollup for builds

## 1.0.3 - 2016-10-11

### Fixes

* Correctly use 'utf-8' instead of default, 'binary', for HMAC signature, thanks [stjohnjohnson](https://github.com/stjohnjohnson)

## 1.0.1 - 2016-05-31

### Added

* This change log
* Dependency checks and npm badges

### Changed

* Change signature check to use a constant time based equality check (see: https://codahale.com/a-lesson-in-timing-attacks/)
* Package had older version of README

## 1.0.0 - 2016-05-30

### Release

* Initial release
