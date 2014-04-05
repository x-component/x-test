#!/bin/bash -x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/../node_modules/mocha/bin/mocha --ui tdd $1/*.tdd.test.js
