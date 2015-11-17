#!/bin/bash -x
$(npm bin)/mocha --ui tdd $1/*.tdd.test.js
