(this["webpackJsonpknock-rod"]=this["webpackJsonpknock-rod"]||[]).push([[0],{2:function(e,t,n){"use strict";(function(e){n.d(t,"c",(function(){return r})),n.d(t,"b",(function(){return i})),n.d(t,"a",(function(){return a})),n.d(t,"h",(function(){return h})),n.d(t,"f",(function(){return f})),n.d(t,"k",(function(){return p})),n.d(t,"i",(function(){return b})),n.d(t,"g",(function(){return j})),n.d(t,"j",(function(){return x})),n.d(t,"d",(function(){return m})),n.d(t,"e",(function(){return w}));var r,i,s,a,c,o,u=n(8);function l(e,t){var n=new Set;return Object.keys(t).forEach((function(t){var r=Number(t);isNaN(r)||(e&r)!==r||n.add(r)})),n}function d(e){var t=0;return e.forEach((function(e){return t|=e})),t}!function(e){e[e.MPOW=1]="MPOW",e[e.SON=2]="SON",e[e.SV=4]="SV",e[e.HEND=8]="HEND",e[e.RMDS=16]="RMDS"}(r||(r={})),function(e){e[e.MOVE=32]="MOVE",e[e.PMSS=256]="PMSS",e[e.PSNS=512]="PSNS",e[e.PUSH=1024]="PUSH",e[e.GHMS=2048]="GHMS",e[e.RMDS=8192]="RMDS",e[e.MPUV=16384]="MPUV",e[e.EMGP=32768]="EMGP"}(i||(i={})),function(e){e[e.PUSH=2]="PUSH",e[e.DIR=4]="DIR",e[e.INC=8]="INC",e[e.MOD0=64]="MOD0",e[e.MOD1=128]="MOD1"}(s||(s={})),function(e){e[e.PEND=8]="PEND",e[e.HEND=16]="HEND",e[e.STP=32]="STP",e[e.BKRL=128]="BKRL",e[e.ABER=256]="ABER",e[e.ALML=512]="ALML",e[e.ALMH=1024]="ALMH",e[e.PSFL=1024]="PSFL",e[e.SV=4096]="SV",e[e.PWR=8192]="PWR",e[e.SFTY=16384]="SFTY",e[e.EMGS=32768]="EMGS"}(a||(a={})),function(e){e[e.PE0=1]="PE0",e[e.PE1=2]="PE1",e[e.PE2=4]="PE2",e[e.PE3=8]="PE3",e[e.PE4=16]="PE4",e[e.PE5=32]="PE5",e[e.PE6=64]="PE6",e[e.PE7=128]="PE7",e[e.JOGNegative=256]="JOGNegative",e[e.JOGPositive=512]="JOGPositive",e[e.TEAC=1024]="TEAC",e[e.MODS=2048]="MODS",e[e.TRQS=4096]="TRQS",e[e.LOAD=4096]="LOAD",e[e.ENBS=32768]="ENBS"}(c||(c={})),function(e){e[e.ReadCoilStatus=1]="ReadCoilStatus",e[e.ReadInputStatus=2]="ReadInputStatus",e[e.ReadHoldingRegisters=3]="ReadHoldingRegisters",e[e.ReadInputRegisters=4]="ReadInputRegisters",e[e.ForceSingleCoil=5]="ForceSingleCoil",e[e.PresetSingleRegister=6]="PresetSingleRegister",e[e.ReadExceptionStatus=7]="ReadExceptionStatus",e[e.ForceMultipleCoils=15]="ForceMultipleCoils",e[e.PresetMultipleRegisters=16]="PresetMultipleRegisters",e[e.ReportSlaveId=17]="ReportSlaveId",e[e.ReadWriteRegister=23]="ReadWriteRegister"}(o||(o={}));var h=y(36864,10);function f(e){var t=k(e),n=new DataView(t);return{pnow:n.getInt32(0),almc:n.getInt16(4),dipm:n.getInt16(6),dipo:n.getInt16(8),dss1:l(n.getUint16(10),a),dss2:l(n.getUint16(12),c),dsse:l(n.getUint16(14),i),stat:l(n.getUint32(16),r)}}function v(e){return S(1031,e?65280:0)}function p(e){return S(1025,e?65280:0)}var b=[v(!0),v(!1)];var j=S(1063,!0?65280:0);function x(e){return S(1027,e?65280:0)}function O(t){var n=new ArrayBuffer(8);g(o.ForceSingleCoil,n);var r=new DataView(n);return r.setUint16(2,1035),r.setUint16(4,t?65280:0),r.setUint16(6,Object(u.a)(e.from(n,0,6)),!0),n}var m=[O(!1),O(!0)];function w(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10,r=arguments.length>2?arguments[2]:void 0,i=arguments.length>3?arguments[3]:void 0,s=arguments.length>4?arguments[4]:void 0,a=arguments.length>5?arguments[5]:void 0,c=new ArrayBuffer(27);g(o.PresetMultipleRegisters,c);var l=new DataView(c);return l.setUint16(2,39168),l.setUint16(4,9),l.setUint8(6,18),l.setInt32(7,t),l.setInt32(11,n),l.setUint32(15,r),l.setUint16(19,i),l.setUint16(21,s),l.setUint16(23,d(a)),l.setUint16(25,Object(u.a)(e.from(c,0,25)),!0),c}S(1068,65280),y(36867,2);function S(t,n){var r=new ArrayBuffer(8);g(o.ForceSingleCoil,r);var i=new DataView(r);return i.setUint16(2,t),i.setUint16(4,n),i.setUint16(6,Object(u.a)(e.from(r,0,6)),!0),r}function g(e,t){var n=new DataView(t);n.setInt8(0,1),n.setInt8(1,e)}function y(t,n){var r=new ArrayBuffer(8);g(o.ReadHoldingRegisters,r);var i=new DataView(r);return i.setUint16(2,t),i.setUint16(4,n),i.setUint16(6,Object(u.a)(e.from(r,0,6)),!0),r}function k(e){E(e);var t=new DataView(e.buffer),n=t.getUint8(2);return t.buffer.slice(3,3+n)}y(36866,1);y(1280,6);function E(t){if(t.length<4)throw new Error("Response must be at least 4 bytes long.");var n=new DataView(t.buffer),r=Object(u.a)(e.from(t.buffer,0,t.length-2)),i=n.getUint16(t.length-2,!0);if(r!==i)throw new Error("CRC missmatch: Expected ".concat(i," but received ").concat(r))}}).call(this,n(3).Buffer)},30:function(e,t,n){},32:function(e,t,n){},42:function(e,t,n){"use strict";n.r(t);var r,i=n(6),s=n.n(i),a=(n(30),n(1)),c=n.n(a),o=n(14),u=n(5),l=n(4),d=n(10),h=(n(32),n(25)),f=n(15),v=n(16),p=n(17),b=n(28),j=n(7),x=n(23),O=n(26),m=n(27),w=n(2),S=n(19),g=n(9),y=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return Math.min(n,Math.max(t,e))},k=function(e,t,n,r,i){return function(e,t,n){return e*(1-n)+t*n}(n,r,function(e,t,n){return y((n-e)/(t-e))}(e,t,i))};!function(e){e[e.FourInch=100]="FourInch",e[e.SixInch=150]="SixInch",e[e.EightInch=200]="EightInch",e[e.TenInch=250]="TenInch",e[e.TwelveInch=300]="TwelveInch"}(r||(r={}));var E=function(e){Object(x.a)(n,e);var t=Object(O.a)(n);function n(e,r){var i;return Object(f.a)(this,n),(i=t.call(this)).port=e,i.size=r,i._state=void 0,i.oscillator={min:0,max:1,speed:0,out:!1,active:!1,acceleration:30},i.oscillatorTimer=void 0,i.onOscillate=Object(l.a)(c.a.mark((function e(){var t,n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.info("onOscillate",i.oscillator),4e4,t=4e4*i.oscillator.speed,!i.oscillator.active){e.next=10;break}n=(i.oscillator.max-i.oscillator.min)*i.size*1e3/t*100,console.info("travel duration:"+n),window.clearTimeout(i.oscillatorTimer),i.oscillatorTimer=window.setTimeout(i.onOscillate.bind(Object(p.a)(i)),n+10),e.next=13;break;case 10:if(!i.oscillatorTimer){e.next=13;break}return window.clearTimeout(i.oscillatorTimer),e.abrupt("return");case 13:return r=(i.oscillator.out?i.oscillator.min:i.oscillator.max)*i.size*100,e.next=16,i.moveTo(r,t,i.oscillator.acceleration);case 16:i.oscillator=Object(u.a)(Object(u.a)({},i.oscillator),{},{out:!i.oscillator.out});case 17:case"end":return e.stop()}}),e)}))),i.trace={time:performance.now(),pos:0,dest:void 0},i.writer=void 0,i.reader=void 0,i.timer=new S.TaskTimer(80),i.mutex=new g.a,i}return Object(v.a)(n,[{key:"oscillate",value:function(){var e=Object(l.a)(c.a.mark((function e(t,n,r,i){var s,a;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s=this.oscillator.active&&this.oscillatorTimer,a=t!==this.oscillator.speed,this.oscillator=Object(u.a)(Object(u.a)({},this.oscillator),{},{min:n,max:r,speed:t,active:t>0,acceleration:i}),s&&!a){e.next=7;break}return e.next=6,this.onOscillate();case 6:return e.abrupt("return",e.sent);case 7:case"end":return e.stop()}}),e,this)})));return function(t,n,r,i){return e.apply(this,arguments)}}()},{key:"state",get:function(){return this._state}},{key:"getEstimatedPosition",value:function(){if(!this.trace.dest)return this.trace.pos;var e=performance.now();return e>this.trace.dest.time?this.trace.dest.pos:k(this.trace.time,this.trace.pos,this.trace.dest.time,this.trace.dest.pos,e)}},{key:"updateState",value:function(e){var t=this._state||{deviceStatusRegister1:new Set,deviceStatusRegister2:new Set,expansionDeviceStatus:new Set,systemStatusRegister:new Set,currentPosition:0,input:0};this._state=e(t),1===(1&this._state.input)?this.dispatchEvent(new CustomEvent("palmdown")):0===(1&this._state.input)&&1===(1&t.input)&&this.dispatchEvent(new CustomEvent("palmup")),this.dispatchEvent(new CustomEvent("stateChange",{detail:{oldState:t,state:this._state}}))}},{key:"setSafetySpeed",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(g.b)(this.mutex,100).acquire();case 2:return r=e.sent,e.prev=3,e.next=6,this.writeBytes(Object(w.k)(t));case 6:return e.t0=console,e.t1=n,e.next=10,this.readBytes(Object(w.k)(t).byteLength);case 10:e.t2=e.sent,e.t3=e.t1.toHex.call(e.t1,e.t2),e.t4="response: "+e.t3,e.t0.info.call(e.t0,e.t4);case 14:return e.prev=14,r(),e.finish(14);case 17:case"end":return e.stop()}}),e,this,[[3,,14,17]])})));return function(t){return e.apply(this,arguments)}}()},{key:"resetAlarm",value:function(){var e=Object(l.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(g.b)(this.mutex,100).acquire();case 2:return t=e.sent,e.prev=3,e.next=6,this.writeBytes(w.i[0]);case 6:return e.t0=console,e.t1=n,e.next=10,this.readBytes(w.i[0].byteLength);case 10:return e.t2=e.sent,e.t3=e.t1.toHex.call(e.t1,e.t2),e.t4="response: "+e.t3,e.t0.info.call(e.t0,e.t4),e.next=16,this.wait(20);case 16:return e.next=18,this.writeBytes(w.i[1]);case 18:return e.t5=console,e.t6=n,e.next=22,this.readBytes(w.i[0].byteLength);case 22:e.t7=e.sent,e.t8=e.t6.toHex.call(e.t6,e.t7),e.t9="response: "+e.t8,e.t5.info.call(e.t5,e.t9);case 26:return e.prev=26,t(),e.finish(26);case 29:case"end":return e.stop()}}),e,this,[[3,,26,29]])})));return function(){return e.apply(this,arguments)}}()},{key:"moveRetract",value:function(){var e=Object(l.a)(c.a.mark((function e(){var t=this;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.timer.add(new S.Task({id:"task-move-retract",totalRuns:1,removeOnCompleted:!0,callback:function(){return t.queryAwaitResponseWithRetry(Object(w.e)(100,10,3e4,30,0,[]),8,(function(e){return e}),1,0)}})),e.abrupt("return",Promise.resolve());case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"moveToWithin",value:function(){var e=Object(l.a)(c.a.mark((function e(t,n,r){var i,s,a,o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.oscillator.active&&(this.oscillator=Object(u.a)(Object(u.a)({},this.oscillator),{},{active:!1}),window.clearTimeout(this.oscillatorTimer)),i=this.getEstimatedPosition(),s=t*this.size*100,a=Math.abs(i-s),0!==(o=a/Math.max(1,n)*1e3)){e.next=7;break}return e.abrupt("return");case 7:return e.next=9,this.moveTo(s,o,r);case 9:return e.abrupt("return",e.sent);case 10:case"end":return e.stop()}}),e,this)})));return function(t,n,r){return e.apply(this,arguments)}}()},{key:"moveTo",value:function(){var e=Object(l.a)(c.a.mark((function e(t,r,i){var s,a,o=this;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s=y(r,1,5e4),a=y(t,0,100*this.size),e.next=4,this.mutex.runExclusive(Object(l.a)(c.a.mark((function e(){var u,l,d,h,f;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u=Math.abs(o.trace.pos-t),l=u/r,d=o.getEstimatedPosition(),h=performance.now(),f=l+h,o.trace={time:h,pos:d,dest:{pos:t,time:f}},e.next=8,o.writeBytes(Object(w.e)(a,10,s,i,0,[]));case 8:return e.t0=console,e.t1=n,e.next=12,o.readBytes(w.d[0].byteLength);case 12:e.t2=e.sent,e.t3=e.t1.toHex.call(e.t1,e.t2),e.t4="response: "+e.t3,e.t0.info.call(e.t0,e.t4);case 16:case"end":return e.stop()}}),e)}))));case 4:case"end":return e.stop()}}),e,this)})));return function(t,n,r){return e.apply(this,arguments)}}()},{key:"moveSimple",value:function(){var e=Object(l.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.moveTo(2e4,3e4,30));case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"home",value:function(){var e=Object(l.a)(c.a.mark((function e(){var t,r=this;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(g.b)(this.mutex,100).acquire();case 2:return t=e.sent,e.prev=3,e.next=6,this.writeBytes(w.d[0]);case 6:return e.t0=console,e.t1=n,e.next=10,this.readBytes(w.d[0].byteLength);case 10:return e.t2=e.sent,e.t3=e.t1.toHex.call(e.t1,e.t2),e.t4="response: "+e.t3,e.t0.info.call(e.t0,e.t4),e.next=16,this.wait(n.silentInterval);case 16:return e.next=18,this.writeBytes(w.d[1]);case 18:return e.t5=console,e.t6=n,e.next=22,this.readBytes(w.d[0].byteLength);case 22:e.t7=e.sent,e.t8=e.t6.toHex.call(e.t6,e.t7),e.t9="response: "+e.t8,e.t5.info.call(e.t5,e.t9);case 26:return e.prev=26,t(),e.finish(26);case 29:return e.next=31,this.wait(200);case 31:return e.prev=31,e.next=34,this.waitUntil(12e3,(function(){var e;return(null===(e=r.state)||void 0===e?void 0:e.deviceStatusRegister1.has(w.a.HEND))||!1}));case 34:this.trace={pos:0,time:performance.now()},e.next=40;break;case 37:throw e.prev=37,e.t10=e.catch(31),new Error("Homing was not successful, waited for 12 seconds");case 40:case"end":return e.stop()}}),e,this,[[3,,26,29],[31,37]])})));return function(){return e.apply(this,arguments)}}()},{key:"addEventListener",value:function(e,t,r){Object(b.a)(Object(j.a)(n.prototype),"addEventListener",this).call(this,e,t,r)}},{key:"setServo",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.info("setting servo "+(t?"on":"off")),e.next=3,Object(g.b)(this.mutex,100).acquire();case 3:return r=e.sent,e.prev=4,e.next=7,this.writeBytes(Object(w.j)(t));case 7:return e.t0=console,e.t1=n,e.next=11,this.readBytes(Object(w.j)(t).byteLength);case 11:e.t2=e.sent,e.t3=e.t1.toHex.call(e.t1,e.t2),e.t4="response: "+e.t3,e.t0.info.call(e.t0,e.t4);case 15:return e.prev=15,r(),e.finish(15);case 18:case"end":return e.stop()}}),e,this,[[4,,15,18]])})));return function(t){return e.apply(this,arguments)}}()},{key:"init",value:function(){var e=Object(l.a)(c.a.mark((function e(){var t,r,i=this;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.port.open(n.SERIAL_OPTIONS);case 2:return this.writer=this.port.writable.getWriter(),this.reader=this.port.readable.getReader(),e.next=6,this.resetAlarm();case 6:return e.next=8,Object(g.b)(this.mutex,100).acquire();case 8:return r=e.sent,e.prev=9,e.next=12,this.writeBytes(w.g);case 12:return e.t0=console,e.t1=n,e.next=16,this.readBytes(w.g.byteLength);case 16:e.t2=e.sent,e.t3=e.t1.toHex.call(e.t1,e.t2),e.t4="response: "+e.t3,e.t0.info.call(e.t0,e.t4);case 20:return e.prev=20,r(),e.finish(20);case 23:return e.next=25,this.setServo(!0);case 25:return e.next=27,this.queryStatusRegister();case 27:if(dispatchEvent(new CustomEvent("connected",{})),this.timer.add(new S.Task({id:"task-poll-status",tickInterval:1,removeOnCompleted:!1,callback:function(e){return i.queryStatusRegister().catch((function(t){console.log("Status query polling failed. Stopping now.",t),e.enabled=!1}))}})),null===(t=this.state)||void 0===t?void 0:t.deviceStatusRegister1.has(w.a.HEND)){e.next=34;break}return console.info("Started Homing. Waiting for homing to complete..."),e.next=33,this.home();case 33:console.info("Waited for homing completed.");case 34:this.timer.start(),dispatchEvent(new CustomEvent("ready",{})),console.info("Initialize complete.");case 37:case"end":return e.stop()}}),e,this,[[9,,20,23]])})));return function(){return e.apply(this,arguments)}}()},{key:"queryStatusRegister",value:function(){var e=Object(l.a)(c.a.mark((function e(){var t=this;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.queryAwaitResponseWithRetry(w.h,25,(function(e){return Object(w.f)(e)}),1,0).then((function(e){return t.updateState((function(t){return Object(u.a)(Object(u.a)({},t),{},{currentPosition:e.pnow,expansionDeviceStatus:e.dsse,deviceStatusRegister1:e.dss1,deviceStatusRegister2:e.dss2,systemStatusRegister:e.stat,input:e.dipm})})),e})));case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"queryAwaitResponseWithRetry",value:function(){var e=Object(l.a)(c.a.mark((function e(t,n,r){var i,s,a,o,u,l,d,h,f,v=arguments;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:i=v.length>3&&void 0!==v[3]?v[3]:void 0,s=v.length>4&&void 0!==v[4]?v[4]:void 0,a=i||3,o=s||100,u=100,l=0;case 6:if(!(l<a)){e.next=31;break}return e.next=9,Object(g.b)(this.mutex,200).acquire();case 9:return d=e.sent,e.prev=10,e.next=13,this.writeBytes(t);case 13:return e.next=15,Promise.any([this.readBytes(n),this.wait(u).then((function(){}))]);case 15:h=e.sent,f=void 0;try{f=h?r(h):void 0}catch(c){f=void 0}if(void 0===f){e.next=22;break}return e.abrupt("return",f);case 22:console.log("response extractor failed for response: "+h);case 23:return e.prev=23,d(),e.finish(23);case 26:return e.next=28,this.wait(o);case 28:++l,e.next=6;break;case 31:throw new Error("Retried "+a+" but failed to accept response.");case 32:case"end":return e.stop()}}),e,this,[[10,,23,26]])})));return function(t,n,r){return e.apply(this,arguments)}}()},{key:"readBytes",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var r,i,s;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=[],i=0;case 2:if(!(i<t)){e.next=14;break}return e.next=5,this.reader.read();case 5:if(!(s=e.sent).done){e.next=10;break}return e.abrupt("break",14);case 10:i+=s.value.length,r.push(s.value);case 12:e.next=2;break;case 14:return e.abrupt("return",n.joinArr(r));case 15:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"writeBytes",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=new Uint8Array(t),e.next=3,this.writer.write(n);case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"wait",value:function(){var e=Object(l.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise((function(e){return setTimeout(e,t)}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"waitUntil",value:function(){var e=Object(l.a)(c.a.mark((function e(t,n){var r,i,s=arguments;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=s.length>2&&void 0!==s[2]?s[2]:100,i=(new Date).getTime()+t;case 2:if(n()){e.next=9;break}return e.next=5,this.wait(r);case 5:if(!((new Date).getTime()>i)){e.next=7;break}throw new Error("Waited for ".concat(n," for ").concat(t,"ms."));case 7:e.next=2;break;case 9:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()}],[{key:"joinArr",value:function(e){if(1===e.length)return e[0];var t,n=new Int8Array(e.reduce((function(e,t){return e+t.length}),0)),r=new Uint8Array(n),i=0,s=Object(o.a)(e);try{for(s.s();!(t=s.n()).done;){var a=t.value;r.set(a,i),i+=a.length}}catch(c){s.e(c)}finally{s.f()}return r}},{key:"toHex",value:function(e){if(void 0!==e)return Object(h.a)(e).map((function(e){return e.toString(16).padStart(2,"0")})).join("").toUpperCase()}}]),n}(Object(m.a)(DocumentFragment));E.silentInterval=2,E.SERIAL_OPTIONS={baudRate:19200,dataBits:8,stopBits:1,parity:"none"};var R=function(){function e(t,n){Object(f.a)(this,e),this.config=t,this.onCommand=n,this.ws=void 0,this.listener=void 0}return Object(v.a)(e,[{key:"sendXToys",value:function(e){var t;console.info("sending",e),null===(t=this.ws)||void 0===t||t.send(JSON.stringify(e)+"\n")}},{key:"stop",value:function(){var e,t;this.listener&&(null===(t=this.ws)||void 0===t||t.removeEventListener("message",this.listener));null===(e=this.ws)||void 0===e||e.close(1e3,"Going Away")}},{key:"start",value:function(){var e=Object(l.a)(c.a.mark((function e(){var t,n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=this,this.ws=new WebSocket("wss://webhook.xtoys.app/".concat(this.config.websocket,"?token=").concat(this.config.token)),this.ws.onopen=function(){},r=new Promise((function(e,t){var r,i;null===(r=n.ws)||void 0===r||r.addEventListener("error",(function(e){t(e)}),{once:!0}),null===(i=n.ws)||void 0===i||i.addEventListener("message",(function(n){try{!0===JSON.parse(n.data).success&&e(void 0)}catch(n){t(n)}}),{once:!0})})),e.next=6,r;case 6:console.info("YAY, connected to xtoys"),null===(t=n.ws)||void 0===t||t.addEventListener("message",(function(e){var t,r=JSON.parse(e.data);null===(t=n.onCommand)||void 0===t||t.call(n,r)}));case 8:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()}]),e}(),P=n(0);function D(e,t){var n=localStorage.getItem(e);return n?JSON.parse(n):t}var M=function(e){var t=Object(i.useState)(D("config",{serialDevice:void 0,xtoys:{token:"",websocket:""}})),n=Object(d.a)(t,2),s=n[0],a=n[1],h=Object(i.useState)(D("params",{speed:0,acceleration:30})),f=Object(d.a)(h,2),v=f[0],p=f[1],b=Object(i.useRef)(v);function j(e){b.current=e,p(e)}var x=Object(i.useState)(!1),O=Object(d.a)(x,2),m=O[0],S=O[1];Object(i.useEffect)((function(){localStorage.setItem("config",JSON.stringify(s))}),[s]);var g,y,k=Object(i.useState)(r.EightInch),M=Object(d.a)(k,2),I=M[0],T=M[1],C=Object(i.useState)(void 0),N=Object(d.a)(C,2),A=N[0],U=N[1],H=Object(i.useRef)(void 0),B=Object(i.useState)(void 0),L=Object(d.a)(B,2),F=L[0],V=L[1];function W(){return(W=Object(l.a)(c.a.mark((function e(){var t,n,r,i,l,d,h,f;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.navigator.serial.getPorts();case 2:t=e.sent,n=Object(o.a)(t),e.prev=4,n.s();case 6:if((r=n.n()).done){e.next=17;break}return d=r.value,e.next=10,null===(i=d.writable)||void 0===i?void 0:i.getWriter().abort();case 10:return e.next=12,null===(l=d.readable)||void 0===l?void 0:l.getReader().cancel("terminating");case 12:if(!d.forget){e.next=15;break}return e.next=15,d.forget();case 15:e.next=6;break;case 17:e.next=22;break;case 19:e.prev=19,e.t0=e.catch(4),n.e(e.t0);case 22:return e.prev=22,n.f(),e.finish(22);case 25:return e.next=27,window.navigator.serial.requestPort({filters:s.serialDevice?[s.serialDevice]:[]});case 27:if((h=e.sent).getInfo().usbVendorId&&h.getInfo().usbProductId){e.next=30;break}throw new Error("Serial device has no vedor or productId");case 30:return a((function(e){return Object(u.a)(Object(u.a)({},e),{},{serialDevice:h.getInfo()})})),(f=new E(h,I)).addEventListener("stateChange",(function(e){return U(e.detail.state)})),S(!0),console.info("connecting to rod..."),e.prev=35,e.next=38,f.init();case 38:H.current=f;case 39:return e.prev=39,console.info("connecting is over"),S(!1),e.finish(39);case 43:console.info("ready for fun");case 44:case"end":return e.stop()}}),e,null,[[4,19,22,25],[35,,39,43]])})))).apply(this,arguments)}function q(){return(q=Object(l.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=new R(s.xtoys,(function(e){G(e)})),e.next=3,t.start();case 3:V(t);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function G(e){var t;if("position"===e.mode)null===(t=H.current)||void 0===t||t.moveToWithin(e.position/100,e.duration,b.current.acceleration),H.current&&console.info("move to "+e.position);else if("speed"===e.mode){var n;console.info("oscillate with",e),null===(n=H.current)||void 0===n||n.oscillate(e.speed/100,e.lower/100,e.upper/100,b.current.acceleration)}else console.info(e)}return Object(P.jsx)("div",{className:"App",children:Object(P.jsxs)("header",{className:"App-header",children:[Object(P.jsxs)("fieldset",{children:[Object(P.jsx)("legend",{children:"XToys"}),Object(P.jsx)("p",{children:'You can have XToys control your device as Custom XToys Webhook Toy. Create a custom toy of type "Stroker or Thrust Toy (Speed + Position)" and add the Websocket credentials here.'}),Object(P.jsxs)("label",{children:["Websocket ",Object(P.jsx)("input",{type:"text",disabled:!!F,onChange:function(e){return a((function(t){return Object(u.a)(Object(u.a)({},t),{},{xtoys:Object(u.a)(Object(u.a)({},t.xtoys),{},{websocket:e.target.value})})}))},value:s.xtoys.websocket})]}),Object(P.jsx)("br",{}),Object(P.jsxs)("label",{children:["Token ",Object(P.jsx)("input",{type:"text",disabled:!!F,onChange:function(e){return a((function(t){return Object(u.a)(Object(u.a)({},t),{},{xtoys:Object(u.a)(Object(u.a)({},t.xtoys),{},{token:e.target.value})})}))},value:s.xtoys.token})]}),Object(P.jsx)("br",{}),Object(P.jsx)("button",{onClick:function(){return function(){return q.apply(this,arguments)}()},disabled:!!F,children:"connect"}),!!F&&Object(P.jsx)("button",{onClick:function(){return null===F||void 0===F||F.stop(),void V(void 0)},children:"disconnect"})]}),!H&&Object(P.jsxs)("p",{children:["Hit ",Object(P.jsx)("code",{children:"start"})," and select your selected actuator from the popup list."]}),H&&A&&Object(P.jsx)("table",{children:Object(P.jsxs)("tbody",{children:[Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Operation mode status (DSSE.PMSS):"}),Object(P.jsx)("td",{children:A.systemStatusRegister.has(w.c.RMDS)?"MANU\ufe0f":"AUTO"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Modbus enabled (DSSE.PMSS):"}),Object(P.jsx)("td",{children:A.expansionDeviceStatus.has(w.b.PMSS)?"\u2714\ufe0f":"\u274c"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Safety speed enabled status (DSS1.SFTY):"}),Object(P.jsxs)("td",{children:[Object(P.jsx)("input",{type:"checkbox",checked:A.deviceStatusRegister1.has(w.a.SFTY),onChange:function(e){var t;return null===(t=H.current)||void 0===t?void 0:t.setSafetySpeed(e.target.checked)}}),A.deviceStatusRegister1.has(w.a.SFTY)?"\u2714\ufe0f":"\u274c"]})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Controller ready status:"}),Object(P.jsx)("td",{children:A.deviceStatusRegister1.has(w.a.PWR)?"\u2714\ufe0f":"\u274c"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Emergency Stop: (DSS1.EMGS)"}),Object(P.jsx)("td",{children:A.deviceStatusRegister1.has(w.a.EMGS)?"\ud83d\udfe0":"\u26aa"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Missed work part in push-motion operation:"}),Object(P.jsx)("td",{children:A.deviceStatusRegister1.has(w.a.PSFL)?"\ud83d\udfe0\ufe0f":"\u26aa"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Servo ON status (DSS1.SV):"}),Object(P.jsx)("td",{children:A.deviceStatusRegister1.has(w.a.SV)?"\ud83d\udfe2":"\u26aa"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Minor failure status (DSS1.ALMH):"}),Object(P.jsx)("td",{children:A.deviceStatusRegister1.has(w.a.ALMH)?"\ud83d\udfe1":"\u26aa"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Major failure alarm present (DSS1.ALMH):"}),Object(P.jsx)("td",{children:A.deviceStatusRegister1.has(w.a.ALMH)?"\ud83d\udd34\ufe0f":"\u26aa"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Input Value:"}),Object(P.jsx)("td",{children:A.input})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Moving signal (DSSE.MOVE):"}),Object(P.jsx)("td",{children:A.expansionDeviceStatus.has(w.b.MOVE)?"\ud83d\udfe2\ufe0f":"\u26aa"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Push Motion in progress signal (DSSE.PUSH):"}),Object(P.jsx)("td",{children:A.expansionDeviceStatus.has(w.b.PUSH)?"\ud83d\udfe2\ufe0f":"\u26aa"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Positioning Ended:"}),Object(P.jsx)("td",{children:A.deviceStatusRegister1.has(w.a.PEND)?"\u2714\ufe0f":"\u274c"})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Homing Ended:"}),Object(P.jsx)("td",{children:A.deviceStatusRegister1.has(w.a.HEND)?"\u2714\ufe0f":"\u274c"})]})]})}),H&&A&&Object(P.jsx)("table",{children:Object(P.jsxs)("tbody",{children:[Object(P.jsxs)("tr",{children:[Object(P.jsxs)("td",{children:["Safety Speed: ",(y=v.speed,new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(y/10)+"cm/s")]}),Object(P.jsx)("td",{children:Object(P.jsx)("input",{type:"range",value:v.speed,onChange:function(e){return j(Object(u.a)(Object(u.a)({},v),{},{speed:parseInt(e.target.value)}))},min:"100",step:"100",max:"40000"})})]}),Object(P.jsxs)("tr",{children:[Object(P.jsxs)("td",{children:["Acceleration: ",function(e){return new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(e/10)+"cm/s^2"}(v.acceleration)]}),Object(P.jsx)("td",{children:Object(P.jsx)("input",{type:"range",value:v.acceleration,onChange:function(e){return j(Object(u.a)(Object(u.a)({},v),{},{acceleration:parseInt(e.target.value)}))},min:"5",step:"1",max:"50"})})]}),Object(P.jsxs)("tr",{children:[Object(P.jsx)("td",{children:"Current Position:"}),Object(P.jsxs)("td",{children:[(g=A.currentPosition,new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(g/10)+"cm"),Object(P.jsx)("br",{}),Object(P.jsx)("input",{type:"range",value:A.currentPosition,disabled:!0,min:"0",max:"20000"})]})]})]})}),Object(P.jsxs)("div",{children:[!A&&!m&&Object(P.jsxs)(P.Fragment,{children:[Object(P.jsxs)("select",{onChange:function(e){return T(Number.parseInt(e.target.value))},value:I,children:[Object(P.jsx)("option",{value:r.EightInch,children:"8 inch (20cm)"}),Object(P.jsx)("option",{value:r.TwelveInch,children:"12 inch (30cm)"})]}),Object(P.jsx)("button",{onClick:function(){return W.apply(this,arguments)},className:"App-link",children:" Start"})]}),m&&Object(P.jsx)("strong",{children:"ROD IS CONNECTING. STAND BY."}),A&&H&&Object(P.jsxs)("div",{children:[Object(P.jsx)("button",{onClick:function(){var e;return null===(e=H.current)||void 0===e?void 0:e.resetAlarm()},disabled:!A,children:" Reset Alarm"}),Object(P.jsx)("button",{onClick:function(){var e;return null===(e=H.current)||void 0===e?void 0:e.moveSimple()},children:" Move up"}),Object(P.jsx)("button",{onClick:function(){var e;return null===(e=H.current)||void 0===e?void 0:e.setServo(!(null===A||void 0===A?void 0:A.deviceStatusRegister1.has(w.a.SV)))},children:" Toggle servo"}),Object(P.jsx)("button",{onClick:function(){var e;return null===(e=H.current)||void 0===e?void 0:e.home()},children:"Home"}),Object(P.jsx)("br",{})]})]}),!H&&Object(P.jsxs)("p",{children:["Find the code on ",Object(P.jsx)("a",{href:"https://github.com/rezreal/knock-lot",children:"github.com/rezreal/knock-lot"}),"."]})]})})},I=n(24),T=document.getElementById("root");Object(I.createRoot)(T).render(Object(P.jsx)(s.a.StrictMode,{children:Object(P.jsx)(M,{})}))}},[[42,1,2]]]);
//# sourceMappingURL=main.a72871d9.chunk.js.map