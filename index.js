'use strict';

/**
 * x-test
 * ------
 *
 * some little test helpers to migrate some vows tests
 */
var async = true;
var call = async ? process.nextTick.bind(process) : function(f){ return f.apply(this,arguments); };

module.exports = {
	vows : function F(suite,test){
		if(suite.addBatch) return;
		suite.addBatch = function F(suites,topics){
			topics = topics||[];
			(function(done){
				call((function(suites,topics,done){ return function(){
					if('topic' in suites ){
						var s_topic=suites['topic'];
						delete suites['topic'];
						(function(s,topics){
							// add a new topic as first topic of topics and pass the previous ones as parameters
							var topic = typeof(s)!=='function' ? s : s.apply({callback:function(){
								topics.unshift.apply(topics,arguments);
								done();
							}},topics);
							
							if(topic){ // sync case
								topics.unshift(topic);
								done();
							}
						})(s_topic,topics);
					} else done ();
				};})(suites,topics,done));
			})(function(){
				for(var n in suites){
					var s_test = suites[n];
					(function(s,n,topics){
						if (typeof(s)==='function'){
							test(n,function(done){
								call((function(s,n,topics,done){ return function(){
									console.log(n);
									s.apply(null,topics); done();
								};})(s,n,[].concat(topics),done));
							});
						} else {
							this(n,function(){ F(s,topics); });
						}
					})(s_test,n,[].concat(topics));
				}
			});
		};
	}
};
