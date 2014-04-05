'use strict';

/**
 * x-test
 * ------
 *
 * little test helpers to migrate some vows tests
 * - we translate a topic to a suiteSetup
 * - a teardown becomes as suiteTearDown
 * - a object with members become a suite
 * - suites are nested.
 * - tests are not.
 * - a suite has at least one test (as required by mocha)
 *
 */
var async = true;
var call = async && process && !process.browser && process.nextTick
	? process.nextTick.bind(process)
	: function(f){ return f.apply(this,arguments); };

module.exports = {
	vows : function F(suite,test,suiteSetup,suiteTeardown){
		if(suite.addBatch) return;
		suite.addBatch = function F(suites,name){
			name = name || 'suite';
			suite(name,function(){
				var self = this;
				self._topics = self._topics || [];
				if('topic' in suites ){
					var s_setup=suites['topic'];
					delete suites['topic'];
					suiteSetup('topic '+name,(function(s){ return function(done){
						var parent_topics = !!(self.parent&&self.parent._topics);
						self._topics = (self._topics || []).concat(parent_topics?self.parent._topics||[]:[]);
						
						// add a new topic as first topic of topics and pass the previous ones as parameters
						var topic = typeof(s)!=='function' ? s : s.apply({callback:function(){
							self._topics.unshift.apply(self._topics,arguments);
							done();
						},timeout:function(ms){self.timeout(ms);}},self._topics);
						
						if(topic){ // sync case
							self._topics.unshift(topic);
							done();
						}
					};})(s_setup));
				}
				
				var s_teardown = null;
				if('teardown' in suites && typeof(suites['teardown'])==='function'){
					s_teardown = suites['teardown'];
					delete suites['teardown'];
					suiteTeardown('teardown '+name,(function(s){ return function(done){
						typeof(s)!=='function' ? s : s.apply(null,self._topics);
						done();
					};})(s_teardown));
				}
				
				var test_found=0;
				for(var n in suites){
					var s_test = suites[n];
					if(typeof(s)==='function'){
						test_found++;
						test(n,(function(s){ return function(done){
							s.apply(null,self._topics);
							done();
						};})(s_test));
					} else {
							F(s_test,n);
					}
				}
				// there must be at least one test in the suite
				if(!test_found){
					test(name,function(done){
						done();
					});
				}
			});
		};
	}
};
