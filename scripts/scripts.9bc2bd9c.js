"use strict";angular.module("hackAndLearnAppApp",["ngAnimate","ngMessages","ngRoute","ngTouch","btford.markdown","ui.bootstrap","config"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/install",{templateUrl:"views/download.html",controller:"DownloadCtrl",controllerAs:"ctrl"}).when("/katas",{templateUrl:"views/katas.html",controller:"KataListCtrl",controllerAs:"ctrl"}).when("/pairing-guide",{controller:"PairingCtrl",templateUrl:"views/pairing.html"}).when("/katas/:kata",{templateUrl:"views/kata-details.html",controller:"KataDetailCtrl",controllerAs:"details"}).otherwise({redirectTo:"/"})}]),angular.module("config",[]).constant("URL_PREFIX",""),angular.module("hackAndLearnAppApp").directive("codeexample",["Katas",function(a){function b(b,c,d){function e(a){var b=c.find("pre > code")[0];b.textContent=a,hljs.highlightBlock(b)}if(!b.fileName)throw new Error("file-name attribute must be set");if(!b.kata)throw new Error("kata attribute must be set");b.content=null,b.exampleUrl=a.exampleUrl(b.kata,b.fileName),b.status={open:!1},b.$watch("content",function(a){e(a)}),b.$watch("status",function(c){c.open&&!b.content&&a.exampleFilePromise(b.kata,b.fileName).then(function(a){b.content=a.data})["catch"](function(a){b.content=a.data})},!0)}return{restrict:"E",templateUrl:"views/directives/code-example.html",scope:{fileName:"=",kata:"="},link:b}}]),angular.module("hackAndLearnAppApp").controller("MainCtrl",["$scope",function(a){}]).controller("PairingCtrl",["$scope",function(a){a.imageUrl="images/pairing-poster.29d5904e.jpg"}]),angular.module("hackAndLearnAppApp").controller("KataListCtrl",["$scope","Katas",function(a,b){a.katas=b.items,a.difficulties=b.difficulties,a.filterDifficulties={};for(var c=0;c<b.difficulties.length;c++)a.filterDifficulties[b.difficulties[c]]=!0;this.encodeURI=window.encodeURI}]).controller("PairingCtrl",["$scope",function(a){a.imageUrl="images/pairing-poster.29d5904e.jpg"}]),angular.module("hackAndLearnAppApp").controller("KataDetailCtrl",["$scope","Katas","$route","$timeout",function(a,b,c,d){var e=c.current.params.kata;if(!angular.isString(e))throw new Error("INTERNAL ERROR: no kata name found in route");var f=b.byName(e);a.kata=f,a.kataName=e,a.description=null,a.$watch("description",function(){d(function(){$(".description pre code").each(function(a,b){hljs.highlightBlock(b)})},500)}),f&&b.descriptionPromise(f).then(function(b){a.description=b.data})["catch"](function(b){a.description=b.data})}]),angular.module("hackAndLearnAppApp").controller("DownloadCtrl",["$scope",function(a){a.platforms=[{name:"OS X",fileName:"rust-1.3.0-x86_64-apple-darwin.pkg"},{name:"Linux",fileName:"rust-1.3.0-x86_64-unknown-linux-gnu.tar.gz"},{name:"Windows",fileName:"rust-1.3.0-x86_64-pc-windows-gnu.msi"}]}]),angular.module("hackAndLearnAppApp").factory("Katas",["$http",function(a){function b(a){return["resources/","katas",a].join("/")}function c(a){for(var b=null,c=0;c<h.length;c++)if(h[c].name===a){b=h[c];break}return b}function d(c){return a.get([b(c.id),"description.md"].join("/"),{cache:!0})}function e(a,c){return[b(a.id),"examples",c].join("/")}function f(b,c){return a.get(e(b,c),{cache:!0})}for(var g=["easy","medium","hard"],h=[{name:"The Reversor",id:"reversor",difficulty:g[0],shortDescription:"Reverse strings via command-line and library"},{name:"Anagrams",id:"anagrams",difficulty:g[0],shortDescription:"A tiny anagram generator",originalSource:"https://github.com/exercism/xjava/tree/master/anagram",example:{files:["java/AnagramTest.java","java/Anagram.java"]}},{name:"Mandelbrot",id:"mandelbrot",difficulty:g[2],shortDescription:"A (multi-threaded) mandelbrot renderer",originalSource:"http://benchmarksgame.alioth.debian.org",example:{files:["mandelbrot.go","mandelbrot.java","mandelbrot.rb","mandelbrot.c"]}},{name:"Simple Lists",id:"linked-list",difficulty:g[1],shortDescription:"Implement a linked list",originalSource:"http://codekata.com/kata/kata21-simple-lists/",example:{files:["linked-list.rb"]}}],i={},j=0;j<h.length;j++){if(h[j].name in i)throw new Error("Duplicate name: "+h[j]);i[h[j].name]=null}return{items:h,difficulties:g,byName:c,descriptionPromise:d,exampleFilePromise:f,exampleUrl:e}}]),angular.module("hackAndLearnAppApp").filter("byDifficulty",function(){function a(a,b){if(!b)return a;var c={};angular.forEach(b,function(a,b){a===!0&&(c[b]=null)});for(var d=[],e=0;e<a.length;e++){var f=a[e];f.difficulty in c&&d.push(f)}return d}return a}),angular.module("hackAndLearnAppApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/directives/code-example.html",'<uib-accordion close-others="oneAtATime"> <uib-accordion-group is-open="status.open"> <uib-accordion-heading> {{fileName}} <i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': status.open, \'glyphicon-chevron-right\': !status.open}"></i> </uib-accordion-heading> <a href="{{exampleUrl}}"> <pre class="animate-show" ng-show="content">\n        <code></code>\n      </pre> </a> </uib-accordion-group> </uib-accordion>'),a.put("views/download.html",'<div class="jumbotron"> <div class="btn-group" uib-dropdown> <button id="single-button" type="button" class="btn btn-primary" uib-dropdown-toggle ng-disabled="disabled"> Download <span class="caret"></span> </button> <ul class="uib-dropdown-menu" role="menu" aria-labelledby="single-button"> <li role="menuitem"><a href="/resources/rust-installers/{{dl.fileName}}" ng-repeat="dl in platforms">For {{dl.name}}</a></li> </ul> </div> </div>'),a.put("views/kata-details.html",'<div class="kata-details" ng-if="kata"> <h2 class="{{kata.difficulty}}"> <a href="{{kata.originalSource}}"> <span ng-if="kata.originalSource" class="glyphicon glyphicon-copyright-mark"></span> </a> {{kata.name}} </h2> <h3>{{kata.shortDescription}}</h3> <div ng-if="description" class="animate-if"> <div btf-markdown="description" class="description"></div>  <div ng-if="!description" class="description-placeholder"></div> </div> </div> <div ng-if="kata.example.files"> <h2>Examples</h2> <codeexample ng-repeat="file in kata.example.files" file-name="file" kata="kata"></codeexample> </div> <div class="no-kata-found" ng-if="!kata"> <p>There is no Kata named \'{{kataName}}\'.</p> </div>'),a.put("views/katas.html",'<div class="jumbotron"> <p> <div class="difficulties-radio btn-group"> <label uib-btn-checkbox ng-repeat="level in difficulties" class="btn btn-primary label" ng-class="level" ng-model="filterDifficulties[level]">{{level}} </label> </div> </p> <p class="lead input-group"> <input type="text" placeholder="search for ..." ng-model="filterText"> </p> </div> <div class="row marketing"> <div ng-repeat="kata in katas | filter:filterText | byDifficulty:filterDifficulties as results track by kata.name"> <h4> <span class="label on-the-left {{kata.difficulty}}"> </span> <a href="#/katas/{{ctrl.encodeURI(kata.name)}}">{{kata.name}}</a> </h4> <p>{{kata.shortDescription}}</p> </div> <div ng-if="results.length === 0"> <strong>No Katas found...</strong> </div> </div>'),a.put("views/main.html",'<div class="jumbotron"> <a class="mantra" href="https://www.rust-lang.org/conduct.html"> <h1>Let\'s be nice to each other</h1> </a> </div>'),a.put("views/pairing.html",'<a href="{{imageUrl}}"> <div class="pairing" style="background-image: url(&quot;{{imageUrl}}&quot;)"> </div> </a>')}]);