# x-test

[Build Status](https://travis-ci.org/x-component/x-test.png?v1.0.0)](https://travis-ci.org/x-component/x-test)

- [./index.js](#indexjs) 

# ./index.js

  - [async](#async)

## async

  x-test
  ------
  
  little test helpers to migrate some vows tests
  - we translate a topic to a suiteSetup
  - a teardown becomes as suiteTearDown
  - a object with members become a suite
  - suites are nested.
  - tests are not.
  - a suite has at least one test (as required by mocha)
