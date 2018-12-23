/*! esri-leaflet - v1.0.0 - 2015-07-10
 *   Copyright (c) 2015 Environmental Systems Research Institute, Inc.
 *   Apache License*/
(function(factory) {
	//define an AMD module that relies on 'leaflet'
	if(typeof define === 'function' && define.amd) {
		define(['leaflet'], function(L) {
			return factory(L);
		});
		//define a common js module that relies on 'leaflet'
	} else if(typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = factory(require('leaflet'));
	}

	if(typeof window !== 'undefined' && window.L) {
		factory(window.L);
	}
}(function(L) {

	var EsriLeaflet = {
		VERSION: "1.0.0",
		Layers: {},
		Services: {},
		Controls: {},
		Tasks: {},
		Util: {},
		Support: {
			CORS: !!(window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest),
			pointerEvents: "" === document.documentElement.style.pointerEvents
		}
	};
	"undefined" != typeof window && window.L && (window.L.esri = EsriLeaflet),
		function(a) {
			function b(a) {
				var b = {};
				for(var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
				return b
			}

			function c(a, b) {
				for(var c = 0; c < a.length; c++)
					if(a[c] !== b[c]) return !1;
				return !0
			}

			function d(a) {
				return c(a[0], a[a.length - 1]) || a.push(a[0]), a
			}

			function e(a) {
				var b, c = 0,
					d = 0,
					e = a.length,
					f = a[d];
				for(d; e - 1 > d; d++) b = a[d + 1], c += (b[0] - f[0]) * (b[1] + f[1]), f = b;
				return c >= 0
			}

			function f(a, b, c, d) {
				var e = (d[0] - c[0]) * (a[1] - c[1]) - (d[1] - c[1]) * (a[0] - c[0]),
					f = (b[0] - a[0]) * (a[1] - c[1]) - (b[1] - a[1]) * (a[0] - c[0]),
					g = (d[1] - c[1]) * (b[0] - a[0]) - (d[0] - c[0]) * (b[1] - a[1]);
				if(0 !== g) {
					var h = e / g,
						i = f / g;
					if(h >= 0 && 1 >= h && i >= 0 && 1 >= i) return !0
				}
				return !1
			}

			function g(a, b) {
				for(var c = 0; c < a.length - 1; c++)
					for(var d = 0; d < b.length - 1; d++)
						if(f(a[c], a[c + 1], b[d], b[d + 1])) return !0;
				return !1
			}

			function h(a, b) {
				for(var c = !1, d = -1, e = a.length, f = e - 1; ++d < e; f = d)(a[d][1] <= b[1] && b[1] < a[f][1] || a[f][1] <= b[1] && b[1] < a[d][1]) && b[0] < (a[f][0] - a[d][0]) * (b[1] - a[d][1]) / (a[f][1] - a[d][1]) + a[d][0] && (c = !c);
				return c
			}

			function i(a, b) {
				var c = g(a, b),
					d = h(a, b[0]);
				return !c && d ? !0 : !1
			}

			function j(a) {
				for(var b, c, f, h = [], j = [], k = 0; k < a.length; k++) {
					var l = d(a[k].slice(0));
					if(!(l.length < 4))
						if(e(l)) {
							var m = [l];
							h.push(m)
						} else j.push(l)
				}
				for(var n = []; j.length;) {
					f = j.pop();
					var o = !1;
					for(b = h.length - 1; b >= 0; b--)
						if(c = h[b][0], i(c, f)) {
							h[b].push(f), o = !0;
							break
						}
					o || n.push(f)
				}
				for(; n.length;) {
					f = n.pop();
					var p = !1;
					for(b = h.length - 1; b >= 0; b--)
						if(c = h[b][0], g(c, f)) {
							h[b].push(f), p = !0;
							break
						}
					p || h.push([f.reverse()])
				}
				return 1 === h.length ? {
					type: "Polygon",
					coordinates: h[0]
				} : {
					type: "MultiPolygon",
					coordinates: h
				}
			}

			function k(a) {
				var b = [],
					c = a.slice(0),
					f = d(c.shift().slice(0));
				if(f.length >= 4) {
					e(f) || f.reverse(), b.push(f);
					for(var g = 0; g < c.length; g++) {
						var h = d(c[g].slice(0));
						h.length >= 4 && (e(h) && h.reverse(), b.push(h))
					}
				}
				return b
			}

			function l(a) {
				for(var b = [], c = 0; c < a.length; c++)
					for(var d = k(a[c]), e = d.length - 1; e >= 0; e--) {
						var f = d[e].slice(0);
						b.push(f)
					}
				return b
			}
			var m = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
				return window.setTimeout(a, 1e3 / 60)
			};
			a.Util.extentToBounds = function(a) {
				var b = new L.LatLng(a.ymin, a.xmin),
					c = new L.LatLng(a.ymax, a.xmax);
				return new L.LatLngBounds(b, c)
			}, a.Util.boundsToExtent = function(a) {
				return a = L.latLngBounds(a), {
					xmin: a.getSouthWest().lng,
					ymin: a.getSouthWest().lat,
					xmax: a.getNorthEast().lng,
					ymax: a.getNorthEast().lat,
					spatialReference: {
						wkid: 4326
					}
				}
			}, a.Util.arcgisToGeojson = function(c, d) {
				var e = {};
				return "number" == typeof c.x && "number" == typeof c.y && (e.type = "Point", e.coordinates = [c.x, c.y]), c.points && (e.type = "MultiPoint", e.coordinates = c.points.slice(0)), c.paths && (1 === c.paths.length ? (e.type = "LineString", e.coordinates = c.paths[0].slice(0)) : (e.type = "MultiLineString", e.coordinates = c.paths.slice(0))), c.rings && (e = j(c.rings.slice(0))), (c.geometry || c.attributes) && (e.type = "Feature", e.geometry = c.geometry ? a.Util.arcgisToGeojson(c.geometry) : null, e.properties = c.attributes ? b(c.attributes) : null, c.attributes && (e.id = c.attributes[d] || c.attributes.OBJECTID || c.attributes.FID)), e
			}, a.Util.geojsonToArcGIS = function(c, d) {
				d = d || "OBJECTID";
				var e, f = {
						wkid: 4326
					},
					g = {};
				switch(c.type) {
					case "Point":
						g.x = c.coordinates[0], g.y = c.coordinates[1], g.spatialReference = f;
						break;
					case "MultiPoint":
						g.points = c.coordinates.slice(0), g.spatialReference = f;
						break;
					case "LineString":
						g.paths = [c.coordinates.slice(0)], g.spatialReference = f;
						break;
					case "MultiLineString":
						g.paths = c.coordinates.slice(0), g.spatialReference = f;
						break;
					case "Polygon":
						g.rings = k(c.coordinates.slice(0)), g.spatialReference = f;
						break;
					case "MultiPolygon":
						g.rings = l(c.coordinates.slice(0)), g.spatialReference = f;
						break;
					case "Feature":
						c.geometry && (g.geometry = a.Util.geojsonToArcGIS(c.geometry, d)), g.attributes = c.properties ? b(c.properties) : {}, c.id && (g.attributes[d] = c.id);
						break;
					case "FeatureCollection":
						for(g = [], e = 0; e < c.features.length; e++) g.push(a.Util.geojsonToArcGIS(c.features[e], d));
						break;
					case "GeometryCollection":
						for(g = [], e = 0; e < c.geometries.length; e++) g.push(a.Util.geojsonToArcGIS(c.geometries[e], d))
				}
				return g
			}, a.Util.responseToFeatureCollection = function(b, c) {
				var d;
				if(c) d = c;
				else if(b.objectIdFieldName) d = b.objectIdFieldName;
				else if(b.fields) {
					for(var e = 0; e <= b.fields.length - 1; e++)
						if("esriFieldTypeOID" === b.fields[e].type) {
							d = b.fields[e].name;
							break
						}
				} else d = "OBJECTID";
				var f = {
						type: "FeatureCollection",
						features: []
					},
					g = b.features || b.results;
				if(g.length)
					for(var h = g.length - 1; h >= 0; h--) f.features.push(a.Util.arcgisToGeojson(g[h], d));
				return f
			}, a.Util.cleanUrl = function(a) {
				return a = a.replace(/^\s+|\s+$|\A\s+|\s+\z/g, ""), "/" !== a[a.length - 1] && (a += "/"), a
			}, a.Util.isArcgisOnline = function(a) {
				return /\.arcgis\.com.*?FeatureServer/g.test(a)
			}, a.Util.geojsonTypeToArcGIS = function(a) {
				var b;
				switch(a) {
					case "Point":
						b = "esriGeometryPoint";
						break;
					case "MultiPoint":
						b = "esriGeometryMultipoint";
						break;
					case "LineString":
						b = "esriGeometryPolyline";
						break;
					case "MultiLineString":
						b = "esriGeometryPolyline";
						break;
					case "Polygon":
						b = "esriGeometryPolygon";
						break;
					case "MultiPolygon":
						b = "esriGeometryPolygon"
				}
				return b
			}, a.Util.requestAnimationFrame = L.Util.bind(m, window), a.Util.warn = function(a) {
				console && console.warn && console.warn(a)
			}
		}(EsriLeaflet),
		function(a) {
			function b(a) {
				var b = "";
				a.f = a.f || "json";
				for(var c in a)
					if(a.hasOwnProperty(c)) {
						var d, e = a[c],
							f = Object.prototype.toString.call(e);
						b.length && (b += "&"), d = "[object Array]" === f ? "[object Object]" === Object.prototype.toString.call(e[0]) ? JSON.stringify(e) : e.join(",") : "[object Object]" === f ? JSON.stringify(e) : "[object Date]" === f ? e.valueOf() : e, b += encodeURIComponent(c) + "=" + encodeURIComponent(d)
					}
				return b
			}

			function c(a, b) {
				var c = new XMLHttpRequest;
				return c.onerror = function(d) {
					c.onreadystatechange = L.Util.falseFn, a.call(b, {
						error: {
							code: 500,
							message: "XMLHttpRequest error"
						}
					}, null)
				}, c.onreadystatechange = function() {
					var d, e;
					if(4 === c.readyState) {
						try {
							d = JSON.parse(c.responseText)
						} catch(f) {
							d = null, e = {
								code: 500,
								message: "Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error."
							}
						}!e && d.error && (e = d.error, d = null), c.onerror = L.Util.falseFn, a.call(b, e, d)
					}
				}, c
			}
			var d = 0;
			window._EsriLeafletCallbacks = {}, a.Request = {
				request: function(d, e, f, g) {
					var h = b(e),
						i = c(f, g),
						j = (d + "?" + h).length;
					if(2e3 >= j && L.esri.Support.CORS) i.open("GET", d + "?" + h), i.send(null);
					else {
						if(!(j > 2e3 && L.esri.Support.CORS)) return 2e3 >= j && !L.esri.Support.CORS ? L.esri.Request.get.JSONP(d, e, f, g) : void a.Util.warn("a request to " + d + " was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html");
						i.open("POST", d), i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), i.send(h)
					}
					return i
				},
				post: {
					XMLHTTP: function(a, d, e, f) {
						var g = c(e, f);
						return g.open("POST", a), g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), g.send(b(d)), g
					}
				},
				get: {
					CORS: function(a, d, e, f) {
						var g = c(e, f);
						return g.open("GET", a + "?" + b(d), !0), g.send(null), g
					},
					JSONP: function(a, c, e, f) {
						var g = "c" + d;
						c.callback = "window._EsriLeafletCallbacks." + g;
						var h = L.DomUtil.create("script", null, document.body);
						return h.type = "text/javascript", h.src = a + "?" + b(c), h.id = g, window._EsriLeafletCallbacks[g] = function(a) {
							if(window._EsriLeafletCallbacks[g] !== !0) {
								var b, c = Object.prototype.toString.call(a);
								"[object Object]" !== c && "[object Array]" !== c && (b = {
									error: {
										code: 500,
										message: "Expected array or object as JSONP response"
									}
								}, a = null), !b && a.error && (b = a, a = null), e.call(f, b, a), window._EsriLeafletCallbacks[g] = !0
							}
						}, d++, {
							id: g,
							url: h.src,
							abort: function() {
								window._EsriLeafletCallbacks._callback[g]({
									code: 0,
									message: "Request aborted."
								})
							}
						}
					}
				}
			}, a.get = a.Support.CORS ? a.Request.get.CORS : a.Request.get.JSONP, a.post = a.Request.post.XMLHTTP, a.request = a.Request.request
		}(EsriLeaflet), EsriLeaflet.Services.Service = L.Class.extend({
			includes: L.Mixin.Events,
			options: {
				proxy: !1,
				useCors: EsriLeaflet.Support.CORS
			},
			initialize: function(a) {
				a = a || {}, this._requestQueue = [], this._authenticating = !1, L.Util.setOptions(this, a), this.options.url = EsriLeaflet.Util.cleanUrl(this.options.url)
			},
			get: function(a, b, c, d) {
				return this._request("get", a, b, c, d)
			},
			post: function(a, b, c, d) {
				return this._request("post", a, b, c, d)
			},
			request: function(a, b, c, d) {
				return this._request("request", a, b, c, d)
			},
			metadata: function(a, b) {
				return this._request("get", "", {}, a, b)
			},
			authenticate: function(a) {
				return this._authenticating = !1, this.options.token = a, this._runQueue(), this
			},
			_request: function(a, b, c, d, e) {
				this.fire("requeststart", {
					url: this.options.url + b,
					params: c,
					method: a
				});
				var f = this._createServiceCallback(a, b, c, d, e);
				if(this.options.token && (c.token = this.options.token), this._authenticating) return void this._requestQueue.push([a, b, c, d, e]);
				var g = this.options.proxy ? this.options.proxy + "?" + this.options.url + b : this.options.url + b;
				return "get" !== a && "request" !== a || this.options.useCors ? EsriLeaflet[a](g, c, f) : EsriLeaflet.Request.get.JSONP(g, c, f)
			},
			_createServiceCallback: function(a, b, c, d, e) {
				return L.Util.bind(function(f, g) {
					!f || 499 !== f.code && 498 !== f.code || (this._authenticating = !0, this._requestQueue.push([a, b, c, d, e]), this.fire("authenticationrequired", {
						authenticate: L.Util.bind(this.authenticate, this)
					}), f.authenticate = L.Util.bind(this.authenticate, this)), d.call(e, f, g), f ? this.fire("requesterror", {
						url: this.options.url + b,
						params: c,
						message: f.message,
						code: f.code,
						method: a
					}) : this.fire("requestsuccess", {
						url: this.options.url + b,
						params: c,
						response: g,
						method: a
					}), this.fire("requestend", {
						url: this.options.url + b,
						params: c,
						method: a
					})
				}, this)
			},
			_runQueue: function() {
				for(var a = this._requestQueue.length - 1; a >= 0; a--) {
					var b = this._requestQueue[a],
						c = b.shift();
					this[c].apply(this, b)
				}
				this._requestQueue = []
			}
		}), EsriLeaflet.Services.service = function(a) {
			return new EsriLeaflet.Services.Service(a)
		}, EsriLeaflet.Services.FeatureLayerService = EsriLeaflet.Services.Service.extend({
			options: {
				idAttribute: "OBJECTID"
			},
			query: function() {
				return new EsriLeaflet.Tasks.Query(this)
			},
			addFeature: function(a, b, c) {
				return delete a.id, a = EsriLeaflet.Util.geojsonToArcGIS(a), this.post("addFeatures", {
					features: [a]
				}, function(a, d) {
					var e = d && d.addResults ? d.addResults[0] : void 0;
					b && b.call(c, a || d.addResults[0].error, e)
				}, c)
			},
			updateFeature: function(a, b, c) {
				return a = EsriLeaflet.Util.geojsonToArcGIS(a, this.options.idAttribute), this.post("updateFeatures", {
					features: [a]
				}, function(a, d) {
					var e = d && d.updateResults ? d.updateResults[0] : void 0;
					b && b.call(c, a || d.updateResults[0].error, e)
				}, c)
			},
			deleteFeature: function(a, b, c) {
				return this.post("deleteFeatures", {
					objectIds: a
				}, function(a, d) {
					var e = d && d.deleteResults ? d.deleteResults[0] : void 0;
					b && b.call(c, a || d.deleteResults[0].error, e)
				}, c)
			},
			deleteFeatures: function(a, b, c) {
				return this.post("deleteFeatures", {
					objectIds: a
				}, function(a, d) {
					var e = d && d.deleteResults ? d.deleteResults : void 0;
					b && b.call(c, a || d.deleteResults[0].error, e)
				}, c)
			}
		}), EsriLeaflet.Services.featureLayerService = function(a) {
			return new EsriLeaflet.Services.FeatureLayerService(a)
		}, EsriLeaflet.Services.MapService = EsriLeaflet.Services.Service.extend({
			identify: function() {
				return new EsriLeaflet.Tasks.identifyFeatures(this)
			},
			find: function() {
				return new EsriLeaflet.Tasks.Find(this)
			},
			query: function() {
				return new EsriLeaflet.Tasks.Query(this)
			}
		}), EsriLeaflet.Services.mapService = function(a) {
			return new EsriLeaflet.Services.MapService(a)
		}, EsriLeaflet.Services.ImageService = EsriLeaflet.Services.Service.extend({
			query: function() {
				return new EsriLeaflet.Tasks.Query(this)
			},
			identify: function() {
				return new EsriLeaflet.Tasks.IdentifyImage(this)
			}
		}), EsriLeaflet.Services.imageService = function(a) {
			return new EsriLeaflet.Services.ImageService(a)
		}, EsriLeaflet.Tasks.Task = L.Class.extend({
			options: {
				proxy: !1,
				useCors: EsriLeaflet.Support.CORS
			},
			generateSetter: function(a, b) {
				return L.Util.bind(function(b) {
					return this.params[a] = b, this
				}, b)
			},
			initialize: function(a) {
				if(a.request && a.options ? (this._service = a, L.Util.setOptions(this, a.options)) : (L.Util.setOptions(this, a), this.options.url = L.esri.Util.cleanUrl(a.url)), this.params = L.Util.extend({}, this.params || {}), this.setters)
					for(var b in this.setters) {
						var c = this.setters[b];
						this[b] = this.generateSetter(c, this)
					}
			},
			token: function(a) {
				return this._service ? this._service.authenticate(a) : this.params.token = a, this
			},
			request: function(a, b) {
				return this._service ? this._service.request(this.path, this.params, a, b) : this._request("request", this.path, this.params, a, b)
			},
			_request: function(a, b, c, d, e) {
				var f = this.options.proxy ? this.options.proxy + "?" + this.options.url + b : this.options.url + b;
				return "get" !== a && "request" !== a || this.options.useCors ? EsriLeaflet[a](f, c, d, e) : EsriLeaflet.Request.get.JSONP(f, c, d, e)
			}
		}), EsriLeaflet.Tasks.Query = EsriLeaflet.Tasks.Task.extend({
			setters: {
				offset: "offset",
				limit: "limit",
				fields: "outFields",
				precision: "geometryPrecision",
				featureIds: "objectIds",
				returnGeometry: "returnGeometry",
				token: "token"
			},
			path: "query",
			params: {
				returnGeometry: !0,
				where: "1=1",
				outSr: 4326,
				outFields: "*"
			},
			within: function(a) {
				return this._setGeometry(a), this.params.spatialRel = "esriSpatialRelContains", this
			},
			intersects: function(a) {
				return this._setGeometry(a), this.params.spatialRel = "esriSpatialRelIntersects", this
			},
			contains: function(a) {
				return this._setGeometry(a), this.params.spatialRel = "esriSpatialRelWithin", this
			},
			overlaps: function(a) {
				return this._setGeometry(a), this.params.spatialRel = "esriSpatialRelOverlaps", this
			},
			nearby: function(a, b) {
				return a = L.latLng(a), this.params.geometry = [a.lng, a.lat], this.params.geometryType = "esriGeometryPoint", this.params.spatialRel = "esriSpatialRelIntersects", this.params.units = "esriSRUnit_Meter", this.params.distance = b, this.params.inSr = 4326, this
			},
			where: function(a) {
				return this.params.where = a, this
			},
			between: function(a, b) {
				return this.params.time = [a.valueOf(), b.valueOf()], this
			},
			simplify: function(a, b) {
				var c = Math.abs(a.getBounds().getWest() - a.getBounds().getEast());
				return this.params.maxAllowableOffset = c / a.getSize().y * b, this
			},
			orderBy: function(a, b) {
				return b = b || "ASC", this.params.orderByFields = this.params.orderByFields ? this.params.orderByFields + "," : "", this.params.orderByFields += [a, b].join(" "), this
			},
			run: function(a, b) {
				return this._cleanParams(), EsriLeaflet.Util.isArcgisOnline(this.options.url) ? (this.params.f = "geojson", this.request(function(c, d) {
					this._trapSQLerrors(c), a.call(b, c, d, d)
				}, this)) : this.request(function(c, d) {
					this._trapSQLerrors(c), a.call(b, c, d && EsriLeaflet.Util.responseToFeatureCollection(d), d)
				}, this)
			},
			count: function(a, b) {
				return this._cleanParams(), this.params.returnCountOnly = !0, this.request(function(b, c) {
					a.call(this, b, c && c.count, c)
				}, b)
			},
			ids: function(a, b) {
				return this._cleanParams(), this.params.returnIdsOnly = !0, this.request(function(b, c) {
					a.call(this, b, c && c.objectIds, c)
				}, b)
			},
			bounds: function(a, b) {
				return this._cleanParams(), this.params.returnExtentOnly = !0, this.request(function(c, d) {
					a.call(b, c, d && d.extent && EsriLeaflet.Util.extentToBounds(d.extent), d)
				}, b)
			},
			pixelSize: function(a) {
				return a = L.point(a), this.params.pixelSize = [a.x, a.y], this
			},
			layer: function(a) {
				return this.path = a + "/query", this
			},
			_trapSQLerrors: function(a) {
				a && "400" === a.code && EsriLeaflet.Util.warn("one common syntax error in query requests is encasing string values in double quotes instead of single quotes")
			},
			_cleanParams: function() {
				delete this.params.returnIdsOnly, delete this.params.returnExtentOnly, delete this.params.returnCountOnly
			},
			_setGeometry: function(a) {
				return this.params.inSr = 4326, a instanceof L.LatLngBounds ? (this.params.geometry = EsriLeaflet.Util.boundsToExtent(a), void(this.params.geometryType = "esriGeometryEnvelope")) : (a.getLatLng && (a = a.getLatLng()), a instanceof L.LatLng && (a = {
					type: "Point",
					coordinates: [a.lng, a.lat]
				}), a instanceof L.GeoJSON && (a = a.getLayers()[0].feature.geometry, this.params.geometry = EsriLeaflet.Util.geojsonToArcGIS(a), this.params.geometryType = EsriLeaflet.Util.geojsonTypeToArcGIS(a.type)), a.toGeoJSON && (a = a.toGeoJSON()), "Feature" === a.type && (a = a.geometry), "Point" === a.type || "LineString" === a.type || "Polygon" === a.type ? (this.params.geometry = EsriLeaflet.Util.geojsonToArcGIS(a), void(this.params.geometryType = EsriLeaflet.Util.geojsonTypeToArcGIS(a.type))) : void EsriLeaflet.Util.warn("invalid geometry passed to spatial query. Should be an L.LatLng, L.LatLngBounds or L.Marker or a GeoJSON Point Line or Polygon object"))
			}
		}), EsriLeaflet.Tasks.query = function(a) {
			return new EsriLeaflet.Tasks.Query(a)
		}, EsriLeaflet.Tasks.Find = EsriLeaflet.Tasks.Task.extend({
			setters: {
				contains: "contains",
				text: "searchText",
				fields: "searchFields",
				spatialReference: "sr",
				sr: "sr",
				layers: "layers",
				returnGeometry: "returnGeometry",
				maxAllowableOffset: "maxAllowableOffset",
				precision: "geometryPrecision",
				dynamicLayers: "dynamicLayers",
				returnZ: "returnZ",
				returnM: "returnM",
				gdbVersion: "gdbVersion",
				token: "token"
			},
			path: "find",
			params: {
				sr: 4326,
				contains: !0,
				returnGeometry: !0,
				returnZ: !0,
				returnM: !1
			},
			layerDefs: function(a, b) {
				return this.params.layerDefs = this.params.layerDefs ? this.params.layerDefs + ";" : "", this.params.layerDefs += [a, b].join(":"), this
			},
			simplify: function(a, b) {
				var c = Math.abs(a.getBounds().getWest() - a.getBounds().getEast());
				return this.params.maxAllowableOffset = c / a.getSize().y * b, this
			},
			run: function(a, b) {
				return this.request(function(c, d) {
					a.call(b, c, d && EsriLeaflet.Util.responseToFeatureCollection(d), d)
				}, b)
			}
		}), EsriLeaflet.Tasks.find = function(a) {
			return new EsriLeaflet.Tasks.Find(a)
		}, EsriLeaflet.Tasks.Identify = EsriLeaflet.Tasks.Task.extend({
			path: "identify",
			between: function(a, b) {
				return this.params.time = [a.valueOf(), b.valueOf()], this
			}
		}), EsriLeaflet.Tasks.IdentifyImage = EsriLeaflet.Tasks.Identify.extend({
			setters: {
				setMosaicRule: "mosaicRule",
				setRenderingRule: "renderingRule",
				setPixelSize: "pixelSize",
				returnCatalogItems: "returnCatalogItems",
				returnGeometry: "returnGeometry"
			},
			params: {
				returnGeometry: !1
			},
			at: function(a) {
				return a = L.latLng(a), this.params.geometry = JSON.stringify({
					x: a.lng,
					y: a.lat,
					spatialReference: {
						wkid: 4326
					}
				}), this.params.geometryType = "esriGeometryPoint", this
			},
			getMosaicRule: function() {
				return this.params.mosaicRule
			},
			getRenderingRule: function() {
				return this.params.renderingRule
			},
			getPixelSize: function() {
				return this.params.pixelSize
			},
			run: function(a, b) {
				return this.request(function(c, d) {
					a.call(b, c, d && this._responseToGeoJSON(d), d)
				}, this)
			},
			_responseToGeoJSON: function(a) {
				var b = a.location,
					c = a.catalogItems,
					d = a.catalogItemVisibilities,
					e = {
						pixel: {
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [b.x, b.y]
							},
							crs: {
								type: "EPSG",
								properties: {
									code: b.spatialReference.wkid
								}
							},
							properties: {
								OBJECTID: a.objectId,
								name: a.name,
								value: a.value
							},
							id: a.objectId
						}
					};
				if(a.properties && a.properties.Values && (e.pixel.properties.values = a.properties.Values), c && c.features && (e.catalogItems = EsriLeaflet.Util.responseToFeatureCollection(c), d && d.length === e.catalogItems.features.length))
					for(var f = d.length - 1; f >= 0; f--) e.catalogItems.features[f].properties.catalogItemVisibility = d[f];
				return e
			}
		}), EsriLeaflet.Tasks.identifyImage = function(a) {
			return new EsriLeaflet.Tasks.IdentifyImage(a)
		}, EsriLeaflet.Tasks.IdentifyFeatures = EsriLeaflet.Tasks.Identify.extend({
			setters: {
				layers: "layers",
				precision: "geometryPrecision",
				tolerance: "tolerance",
				returnGeometry: "returnGeometry"
			},
			params: {
				sr: 4326,
				layers: "all",
				tolerance: 3,
				returnGeometry: !0
			},
			on: function(a) {
				var b = EsriLeaflet.Util.boundsToExtent(a.getBounds()),
					c = a.getSize();
				return this.params.imageDisplay = [c.x, c.y, 96], this.params.mapExtent = [b.xmin, b.ymin, b.xmax, b.ymax], this
			},
			at: function(a) {
				return a = L.latLng(a), this.params.geometry = [a.lng, a.lat], this.params.geometryType = "esriGeometryPoint", this
			},
			layerDef: function(a, b) {
				return this.params.layerDefs = this.params.layerDefs ? this.params.layerDefs + ";" : "", this.params.layerDefs += [a, b].join(":"), this
			},
			simplify: function(a, b) {
				var c = Math.abs(a.getBounds().getWest() - a.getBounds().getEast());
				return this.params.maxAllowableOffset = c / a.getSize().y * (1 - b), this
			},
			run: function(a, b) {
				return this.request(function(c, d) {
					if(c) return void a.call(b, c, void 0, d);
					var e = EsriLeaflet.Util.responseToFeatureCollection(d);
					d.results = d.results.reverse();
					for(var f = 0; f < e.features.length; f++) {
						var g = e.features[f];
						g.layerId = d.results[f].layerId
					}
					a.call(b, void 0, e, d)
				})
			}
		}), EsriLeaflet.Tasks.identifyFeatures = function(a) {
			return new EsriLeaflet.Tasks.IdentifyFeatures(a)
		},
		function(a) {
			var b = "https:" !== window.location.protocol ? "http:" : "https:";
			a.Layers.BasemapLayer = L.TileLayer.extend({
				statics: {
					TILES: {
						Streets: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
							attributionUrl: "https://static.arcgis.com/attribution/World_Street_Map",
							options: {
								hideLogo: !1,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 19,
								subdomains: ["server", "services"],
								attribution: "Esri"
							}
						},
						Topographic: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
							attributionUrl: "https://static.arcgis.com/attribution/World_Topo_Map",
							options: {
								hideLogo: !1,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 19,
								subdomains: ["server", "services"],
								attribution: "Esri"
							}
						},
						Oceans: {
							urlTemplate: b + "//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
							attributionUrl: "https://static.arcgis.com/attribution/Ocean_Basemap",
							options: {
								hideLogo: !1,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 16,
								subdomains: ["server", "services"],
								attribution: "Esri"
							}
						},
						OceansLabels: {
							urlTemplate: b + "//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !0,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 16,
								subdomains: ["server", "services"]
							}
						},
						NationalGeographic: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !1,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 16,
								subdomains: ["server", "services"],
								attribution: "Esri"
							}
						},
						DarkGray: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !1,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 16,
								subdomains: ["server", "services"],
								attribution: "Esri, DeLorme, HERE"
							}
						},
						DarkGrayLabels: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !0,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 16,
								subdomains: ["server", "services"]
							}
						},
						Gray: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !1,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 16,
								subdomains: ["server", "services"],
								attribution: "Esri, NAVTEQ, DeLorme"
							}
						},
						GrayLabels: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !0,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 16,
								subdomains: ["server", "services"]
							}
						},
						Imagery: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !1,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 19,
								subdomains: ["server", "services"],
								attribution: "Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community"
							}
						},
						ImageryLabels: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !0,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 19,
								subdomains: ["server", "services"]
							}
						},
						ImageryTransportation: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !0,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 19,
								subdomains: ["server", "services"]
							}
						},
						ShadedRelief: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !1,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 13,
								subdomains: ["server", "services"],
								attribution: "Esri, NAVTEQ, DeLorme"
							}
						},
						ShadedReliefLabels: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !0,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 12,
								subdomains: ["server", "services"]
							}
						},
						Terrain: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !1,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 13,
								subdomains: ["server", "services"],
								attribution: "Esri, USGS, NOAA"
							}
						},
						TerrainLabels: {
							urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",
							options: {
								hideLogo: !0,
								logoPosition: "bottomright",
								minZoom: 1,
								maxZoom: 13,
								subdomains: ["server", "services"]
							}
						}
					}
				},
				initialize: function(b, c) {
					var d;
					if("object" == typeof b && b.urlTemplate && b.options) d = b;
					else {
						if("string" != typeof b || !a.BasemapLayer.TILES[b]) throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ShadedRelief", "ShadedReliefLabels", "Terrain" or "TerrainLabels"');
						d = a.BasemapLayer.TILES[b]
					}
					var e = L.Util.extend(d.options, c);
					L.TileLayer.prototype.initialize.call(this, d.urlTemplate, L.Util.setOptions(this, e)), d.attributionUrl && this._getAttributionData(d.attributionUrl), this._logo = new a.Controls.Logo({
						position: this.options.logoPosition
					})
				},
				onAdd: function(a) {
					this.options.hideLogo || a._hasEsriLogo || (this._logo.addTo(a), a._hasEsriLogo = !0), L.TileLayer.prototype.onAdd.call(this, a), a.on("moveend", this._updateMapAttribution, this)
				},
				onRemove: function(a) {
					this._logo && this._logo._container && (a.removeControl(this._logo), a._hasEsriLogo = !1), L.TileLayer.prototype.onRemove.call(this, a), a.off("moveend", this._updateMapAttribution, this)
				},
				getAttribution: function() {
					var a = '<span class="esri-attributions" style="line-height:14px; vertical-align: -3px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; display:inline-block;">' + this.options.attribution + "</span>";
					return a
				},
				_getAttributionData: function(a) {
					L.esri.Request.get.JSONP(a, {}, L.Util.bind(function(a, b) {
						this._attributions = [];
						for(var c = 0; c < b.contributors.length; c++)
							for(var d = b.contributors[c], e = 0; e < d.coverageAreas.length; e++) {
								var f = d.coverageAreas[e],
									g = new L.LatLng(f.bbox[0], f.bbox[1]),
									h = new L.LatLng(f.bbox[2], f.bbox[3]);
								this._attributions.push({
									attribution: d.attribution,
									score: f.score,
									bounds: new L.LatLngBounds(g, h),
									minZoom: f.zoomMin,
									maxZoom: f.zoomMax
								})
							}
						this._attributions.sort(function(a, b) {
							return b.score - a.score
						}), this._updateMapAttribution()
					}, this))
				},
				_updateMapAttribution: function() {
					if(this._map && this._map.attributionControl && this._attributions) {
						for(var a = "", b = this._map.getBounds(), c = this._map.getZoom(), d = 0; d < this._attributions.length; d++) {
							var e = this._attributions[d],
								f = e.attribution;
							!a.match(f) && b.intersects(e.bounds) && c >= e.minZoom && c <= e.maxZoom && (a += ", " + f)
						}
						a = a.substr(2);
						var g = this._map.attributionControl._container.querySelector(".esri-attributions");
						g.innerHTML = a, g.style.maxWidth = .65 * this._map.getSize().x + "px", this.fire("attributionupdated", {
							attribution: a
						})
					}
				}
			}), a.BasemapLayer = a.Layers.BasemapLayer, a.Layers.basemapLayer = function(b, c) {
				return new a.Layers.BasemapLayer(b, c)
			}, a.basemapLayer = function(b, c) {
				return new a.Layers.BasemapLayer(b, c)
			}
		}(EsriLeaflet), EsriLeaflet.Layers.RasterLayer = L.Class.extend({
			includes: L.Mixin.Events,
			options: {
				opacity: 1,
				position: "front",
				f: "image"
			},
			onAdd: function(a) {
				if(this._map = a, this._update = L.Util.limitExecByInterval(this._update, this.options.updateInterval, this), a.options.crs && a.options.crs.code) {
					var b = a.options.crs.code.split(":")[1];
					this.options.bboxSR = b, this.options.imageSR = b
				}
				a.on("moveend", this._update, this), this._currentImage && this._currentImage._bounds.equals(this._map.getBounds()) ? a.addLayer(this._currentImage) : this._currentImage && (this._map.removeLayer(this._currentImage), this._currentImage = null), this._update(), this._popup && (this._map.on("click", this._getPopupData, this), this._map.on("dblclick", this._resetPopupState, this))
			},
			bindPopup: function(a, b) {
				return this._shouldRenderPopup = !1, this._lastClick = !1, this._popup = L.popup(b), this._popupFunction = a, this._map && (this._map.on("click", this._getPopupData, this), this._map.on("dblclick", this._resetPopupState, this)), this
			},
			unbindPopup: function() {
				return this._map && (this._map.closePopup(this._popup), this._map.off("click", this._getPopupData, this), this._map.off("dblclick", this._resetPopupState, this)), this._popup = !1, this
			},
			onRemove: function(a) {
				this._currentImage && this._map.removeLayer(this._currentImage), this._popup && (this._map.off("click", this._getPopupData, this), this._map.off("dblclick", this._resetPopupState, this)), this._map.off("moveend", this._update, this), this._map = null
			},
			addTo: function(a) {
				return a.addLayer(this), this
			},
			removeFrom: function(a) {
				return a.removeLayer(this), this
			},
			bringToFront: function() {
				return this.options.position = "front", this._currentImage && this._currentImage.bringToFront(), this
			},
			bringToBack: function() {
				return this.options.position = "back", this._currentImage && this._currentImage.bringToBack(), this
			},
			getAttribution: function() {
				return this.options.attribution
			},
			getOpacity: function() {
				return this.options.opacity
			},
			setOpacity: function(a) {
				return this.options.opacity = a, this._currentImage.setOpacity(a), this
			},
			getTimeRange: function() {
				return [this.options.from, this.options.to]
			},
			setTimeRange: function(a, b) {
				return this.options.from = a, this.options.to = b, this._update(), this
			},
			metadata: function(a, b) {
				return this._service.metadata(a, b), this
			},
			authenticate: function(a) {
				return this._service.authenticate(a), this
			},
			_renderImage: function(a, b) {
				if(this._map) {
					var c = new L.ImageOverlay(a, b, {
						opacity: 0
					}).addTo(this._map);
					c.once("load", function(a) {
						var c = a.target,
							d = this._currentImage;
						c._bounds.equals(b) && c._bounds.equals(this._map.getBounds()) ? (this._currentImage = c, "front" === this.options.position ? this.bringToFront() : this.bringToBack(), this._map && this._currentImage._map ? this._currentImage.setOpacity(this.options.opacity) : this._currentImage._map.removeLayer(this._currentImage), d && this._map && this._map.removeLayer(d), d && d._map && d._map.removeLayer(d)) : this._map.removeLayer(c), this.fire("load", {
							bounds: b
						})
					}, this), this.fire("loading", {
						bounds: b
					})
				}
			},
			_update: function() {
				if(this._map) {
					var a = this._map.getZoom(),
						b = this._map.getBounds();
					if(!this._animatingZoom && !(this._map._panTransition && this._map._panTransition._inProgress || a > this.options.maxZoom || a < this.options.minZoom)) {
						var c = this._buildExportParams();
						this._requestExport(c, b)
					}
				}
			},
			_renderPopup: function(a, b, c, d) {
				if(a = L.latLng(a), this._shouldRenderPopup && this._lastClick.equals(a)) {
					var e = this._popupFunction(b, c, d);
					e && this._popup.setLatLng(a).setContent(e).openOn(this._map)
				}
			},
			_resetPopupState: function(a) {
				this._shouldRenderPopup = !1, this._lastClick = a.latlng
			},
			_propagateEvent: function(a) {
				a = L.extend({
					layer: a.target,
					target: this
				}, a), this.fire(a.type, a)
			}
		}), EsriLeaflet.Layers.DynamicMapLayer = EsriLeaflet.Layers.RasterLayer.extend({
			options: {
				updateInterval: 150,
				layers: !1,
				layerDefs: !1,
				timeOptions: !1,
				format: "png24",
				transparent: !0,
				f: "json"
			},
			initialize: function(a) {
				a.url = EsriLeaflet.Util.cleanUrl(a.url), this._service = new EsriLeaflet.Services.MapService(a), this._service.on("authenticationrequired requeststart requestend requesterror requestsuccess", this._propagateEvent, this), (a.proxy || a.token) && "json" !== a.f && (a.f = "json"), L.Util.setOptions(this, a)
			},
			getDynamicLayers: function() {
				return this.options.dynamicLayers
			},
			setDynamicLayers: function(a) {
				return this.options.dynamicLayers = a, this._update(), this
			},
			getLayers: function() {
				return this.options.layers
			},
			setLayers: function(a) {
				return this.options.layers = a, this._update(), this
			},
			getLayerDefs: function() {
				return this.options.layerDefs
			},
			setLayerDefs: function(a) {
				return this.options.layerDefs = a, this._update(), this
			},
			getTimeOptions: function() {
				return this.options.timeOptions
			},
			setTimeOptions: function(a) {
				return this.options.timeOptions = a, this._update(), this
			},
			query: function() {
				return this._service.query()
			},
			identify: function() {
				return this._service.identify()
			},
			find: function() {
				return this._service.find()
			},
			_getPopupData: function(a) {
				var b = L.Util.bind(function(b, c, d) {
						b || setTimeout(L.Util.bind(function() {
							this._renderPopup(a.latlng, b, c, d)
						}, this), 300)
					}, this),
					c = this.identify().on(this._map).at(a.latlng);
				this.options.layers ? c.layers("visible:" + this.options.layers.join(",")) : c.layers("visible"), c.run(b), this._shouldRenderPopup = !0, this._lastClick = a.latlng
			},
			_buildExportParams: function() {
				var a = this._map.getBounds(),
					b = this._map.getSize(),
					c = this._map.options.crs.project(a._northEast),
					d = this._map.options.crs.project(a._southWest),
					e = this._map.latLngToLayerPoint(a._northEast),
					f = this._map.latLngToLayerPoint(a._southWest);
				(e.y > 0 || f.y < b.y) && (b.y = f.y - e.y);
				var g = {
					bbox: [d.x, d.y, c.x, c.y].join(","),
					size: b.x + "," + b.y,
					dpi: 96,
					format: this.options.format,
					transparent: this.options.transparent,
					bboxSR: this.options.bboxSR,
					imageSR: this.options.imageSR
				};
				return this.options.dynamicLayers && (g.dynamicLayers = this.options.dynamicLayers), this.options.layers && (g.layers = "show:" + this.options.layers.join(",")), this.options.layerDefs && (g.layerDefs = JSON.stringify(this.options.layerDefs)), this.options.timeOptions && (g.timeOptions = JSON.stringify(this.options.timeOptions)), this.options.from && this.options.to && (g.time = this.options.from.valueOf() + "," + this.options.to.valueOf()), this._service.options.token && (g.token = this._service.options.token), g
			},
			_requestExport: function(a, b) {
				"json" === this.options.f ? this._service.request("export", a, function(a, c) {
					a || this._renderImage(c.href, b)
				}, this) : (a.f = "image", this._renderImage(this.options.url + "export" + L.Util.getParamString(a), b))
			}
		}), EsriLeaflet.DynamicMapLayer = EsriLeaflet.Layers.DynamicMapLayer, EsriLeaflet.Layers.dynamicMapLayer = function(a) {
			return new EsriLeaflet.Layers.DynamicMapLayer(a)
		}, EsriLeaflet.dynamicMapLayer = function(a) {
			return new EsriLeaflet.Layers.DynamicMapLayer(a)
		}, EsriLeaflet.Layers.ImageMapLayer = EsriLeaflet.Layers.RasterLayer.extend({
			options: {
				updateInterval: 150,
				format: "jpgpng",
				transparent: !0,
				f: "json"
			},
			query: function() {
				return this._service.query()
			},
			identify: function() {
				return this._service.identify()
			},
			initialize: function(a) {
				a.url = EsriLeaflet.Util.cleanUrl(a.url), this._service = new EsriLeaflet.Services.ImageService(a), this._service.on("authenticationrequired requeststart requestend requesterror requestsuccess", this._propagateEvent, this), L.Util.setOptions(this, a)
			},
			setPixelType: function(a) {
				return this.options.pixelType = a, this._update(), this
			},
			getPixelType: function() {
				return this.options.pixelType
			},
			setBandIds: function(a) {
				return L.Util.isArray(a) ? this.options.bandIds = a.join(",") : this.options.bandIds = a.toString(), this._update(), this
			},
			getBandIds: function() {
				return this.options.bandIds
			},
			setNoData: function(a, b) {
				return L.Util.isArray(a) ? this.options.noData = a.join(",") : this.options.noData = a.toString(), b && (this.options.noDataInterpretation = b), this._update(), this
			},
			getNoData: function() {
				return this.options.noData
			},
			getNoDataInterpretation: function() {
				return this.options.noDataInterpretation
			},
			setRenderingRule: function(a) {
				this.options.renderingRule = a, this._update()
			},
			getRenderingRule: function() {
				return this.options.renderingRule
			},
			setMosaicRule: function(a) {
				this.options.mosaicRule = a, this._update()
			},
			getMosaicRule: function() {
				return this.options.mosaicRule
			},
			_getPopupData: function(a) {
				var b = L.Util.bind(function(b, c, d) {
						b || setTimeout(L.Util.bind(function() {
							this._renderPopup(a.latlng, b, c, d)
						}, this), 300)
					}, this),
					c = this.identify().at(a.latlng);
				this.options.mosaicRule && c.setMosaicRule(this.options.mosaicRule), c.run(b), this._shouldRenderPopup = !0, this._lastClick = a.latlng
			},
			_buildExportParams: function() {
				var a = this._map.getBounds(),
					b = this._map.getSize(),
					c = this._map.options.crs.project(a._northEast),
					d = this._map.options.crs.project(a._southWest),
					e = {
						bbox: [d.x, d.y, c.x, c.y].join(","),
						size: b.x + "," + b.y,
						format: this.options.format,
						transparent: this.options.transparent,
						bboxSR: this.options.bboxSR,
						imageSR: this.options.imageSR
					};
				return this.options.from && this.options.to && (e.time = this.options.from.valueOf() + "," + this.options.to.valueOf()), this.options.pixelType && (e.pixelType = this.options.pixelType), this.options.interpolation && (e.interpolation = this.options.interpolation), this.options.compressionQuality && (e.compressionQuality = this.options.compressionQuality), this.options.bandIds && (e.bandIds = this.options.bandIds), this.options.noData && (e.noData = this.options.noData), this.options.noDataInterpretation && (e.noDataInterpretation = this.options.noDataInterpretation), this._service.options.token && (e.token = this._service.options.token), this.options.renderingRule && (e.renderingRule = JSON.stringify(this.options.renderingRule)), this.options.mosaicRule && (e.mosaicRule = JSON.stringify(this.options.mosaicRule)), e
			},
			_requestExport: function(a, b) {
				"json" === this.options.f ? this._service.request("exportImage", a, function(a, c) {
					a || this._renderImage(c.href, b)
				}, this) : (a.f = "image", this._renderImage(this.options.url + "exportImage" + L.Util.getParamString(a), b))
			}
		}), EsriLeaflet.ImageMapLayer = EsriLeaflet.Layers.ImageMapLayer, EsriLeaflet.Layers.imageMapLayer = function(a) {
			return new EsriLeaflet.Layers.ImageMapLayer(a)
		}, EsriLeaflet.imageMapLayer = function(a) {
			return new EsriLeaflet.Layers.ImageMapLayer(a)
		}, EsriLeaflet.Layers.TiledMapLayer = L.TileLayer.extend({
			options: {
				zoomOffsetAllowance: .1,
				correctZoomLevels: !0
			},
			statics: {
				MercatorZoomLevels: {
					0: 156543.033928,
					1: 78271.5169639999,
					2: 39135.7584820001,
					3: 19567.8792409999,
					4: 9783.93962049996,
					5: 4891.96981024998,
					6: 2445.98490512499,
					7: 1222.99245256249,
					8: 611.49622628138,
					9: 305.748113140558,
					10: 152.874056570411,
					11: 76.4370282850732,
					12: 38.2185141425366,
					13: 19.1092570712683,
					14: 9.55462853563415,
					15: 4.77731426794937,
					16: 2.38865713397468,
					17: 1.19432856685505,
					18: .597164283559817,
					19: .298582141647617,
					20: .14929107082381,
					21: .07464553541191,
					22: .0373227677059525,
					23: .0186613838529763
				}
			},
			initialize: function(a) {
				a.url = EsriLeaflet.Util.cleanUrl(a.url), a = L.Util.setOptions(this, a), this.tileUrl = L.esri.Util.cleanUrl(a.url) + "tile/{z}/{y}/{x}", this._service = new L.esri.Services.MapService(a), this._service.on("authenticationrequired requeststart requestend requesterror requestsuccess", this._propagateEvent, this), this.tileUrl.match("://tiles.arcgisonline.com") && (this.tileUrl = this.tileUrl.replace("://tiles.arcgisonline.com", "://tiles{s}.arcgisonline.com"), a.subdomains = ["1", "2", "3", "4"]), this.options.token && (this.tileUrl += "?token=" + this.options.token), L.TileLayer.prototype.initialize.call(this, this.tileUrl, a)
			},
			getTileUrl: function(a) {
				return L.Util.template(this.tileUrl, L.extend({
					s: this._getSubdomain(a),
					z: this._lodMap[a.z] || a.z,
					x: a.x,
					y: a.y
				}, this.options))
			},
			onAdd: function(a) {
				!this._lodMap && this.options.correctZoomLevels ? (this._lodMap = {}, this.metadata(function(b, c) {
					if(!b) {
						var d = c.spatialReference.latestWkid || c.spatialReference.wkid;
						if(102100 === d || 3857 === d)
							for(var e = c.tileInfo.lods, f = EsriLeaflet.Layers.TiledMapLayer.MercatorZoomLevels, g = 0; g < e.length; g++) {
								var h = e[g];
								for(var i in f) {
									var j = f[i];
									if(this._withinPercentage(h.resolution, j, this.options.zoomOffsetAllowance)) {
										this._lodMap[i] = h.level;
										break
									}
								}
							} else EsriLeaflet.Util.warn("L.esri.TiledMapLayer is using a non-mercator spatial reference. Support may be available through Proj4Leaflet http://esri.github.io/esri-leaflet/examples/non-mercator-projection.html")
					}
					L.TileLayer.prototype.onAdd.call(this, a)
				}, this)) : L.TileLayer.prototype.onAdd.call(this, a)
			},
			metadata: function(a, b) {
				return this._service.metadata(a, b), this
			},
			identify: function() {
				return this._service.identify()
			},
			authenticate: function(a) {
				var b = "?token=" + a;
				return this.tileUrl = this.options.token ? this.tileUrl.replace(/\?token=(.+)/g, b) : this.tileUrl + b, this.options.token = a, this._service.authenticate(a), this
			},
			_propagateEvent: function(a) {
				a = L.extend({
					layer: a.target,
					target: this
				}, a), this.fire(a.type, a)
			},
			_withinPercentage: function(a, b, c) {
				var d = Math.abs(a / b - 1);
				return c > d
			}
		}), L.esri.TiledMapLayer = L.esri.Layers.tiledMapLayer, L.esri.Layers.tiledMapLayer = function(a) {
			return new L.esri.Layers.TiledMapLayer(a)
		}, L.esri.tiledMapLayer = function(a) {
			return new L.esri.Layers.TiledMapLayer(a)
		}, EsriLeaflet.Layers.FeatureGrid = L.Class.extend({
			includes: L.Mixin.Events,
			options: {
				cellSize: 512,
				updateInterval: 150
			},
			initialize: function(a) {
				a = L.setOptions(this, a)
			},
			onAdd: function(a) {
				this._map = a, this._update = L.Util.limitExecByInterval(this._update, this.options.updateInterval, this), this._map.addEventListener(this.getEvents(), this), this._reset(), this._update()
			},
			onRemove: function() {
				this._map.removeEventListener(this.getEvents(), this), this._removeCells()
			},
			getEvents: function() {
				var a = {
					viewreset: this._reset,
					moveend: this._update,
					zoomend: this._onZoom
				};
				return a
			},
			addTo: function(a) {
				return a.addLayer(this), this
			},
			removeFrom: function(a) {
				return a.removeLayer(this), this
			},
			_onZoom: function() {
				var a = this._map.getZoom();
				a > this.options.maxZoom || a < this.options.minZoom ? (this.removeFrom(this._map), this._map.addEventListener("zoomend", this.getEvents().zoomend, this)) : this._map.hasLayer(this) || (this._map.removeEventListener("zoomend", this.getEvents().zoomend, this), this.addTo(this._map))
			},
			_reset: function() {
				this._removeCells(), this._cells = {}, this._activeCells = {}, this._cellsToLoad = 0, this._cellsTotal = 0, this._resetWrap()
			},
			_resetWrap: function() {
				var a = this._map,
					b = a.options.crs;
				if(!b.infinite) {
					var c = this._getCellSize();
					b.wrapLng && (this._wrapLng = [Math.floor(a.project([0, b.wrapLng[0]]).x / c), Math.ceil(a.project([0, b.wrapLng[1]]).x / c)]), b.wrapLat && (this._wrapLat = [Math.floor(a.project([b.wrapLat[0], 0]).y / c), Math.ceil(a.project([b.wrapLat[1], 0]).y / c)])
				}
			},
			_getCellSize: function() {
				return this.options.cellSize
			},
			_update: function() {
				if(this._map) {
					var a = this._map.getPixelBounds(),
						b = this._map.getZoom(),
						c = this._getCellSize(),
						d = [c / 2, c / 2];
					if(!(b > this.options.maxZoom || b < this.options.minZoom)) {
						var e = a.min.subtract(d).divideBy(c).floor();
						e.x = Math.max(e.x, 0), e.y = Math.max(e.y, 0);
						var f = L.bounds(e, a.max.add(d).divideBy(c).floor());
						this._removeOtherCells(f), this._addCells(f)
					}
				}
			},
			_addCells: function(a) {
				var b, c, d, e = [],
					f = a.getCenter(),
					g = this._map.getZoom();
				for(b = a.min.y; b <= a.max.y; b++)
					for(c = a.min.x; c <= a.max.x; c++) d = new L.Point(c, b), d.z = g, e.push(d);
				var h = e.length;
				if(0 !== h)
					for(this._cellsToLoad += h, this._cellsTotal += h, e.sort(function(a, b) {
							return a.distanceTo(f) - b.distanceTo(f)
						}), c = 0; h > c; c++) this._addCell(e[c])
			},
			_cellCoordsToBounds: function(a) {
				var b = this._map,
					c = this.options.cellSize,
					d = a.multiplyBy(c),
					e = d.add([c, c]),
					f = b.unproject(d, a.z).wrap(),
					g = b.unproject(e, a.z).wrap();
				return new L.LatLngBounds(f, g)
			},
			_cellCoordsToKey: function(a) {
				return a.x + ":" + a.y
			},
			_keyToCellCoords: function(a) {
				var b = a.split(":"),
					c = parseInt(b[0], 10),
					d = parseInt(b[1], 10);
				return new L.Point(c, d)
			},
			_removeOtherCells: function(a) {
				for(var b in this._cells) a.contains(this._keyToCellCoords(b)) || this._removeCell(b)
			},
			_removeCell: function(a) {
				var b = this._activeCells[a];
				b && (delete this._activeCells[a], this.cellLeave && this.cellLeave(b.bounds, b.coords), this.fire("cellleave", {
					bounds: b.bounds,
					coords: b.coords
				}))
			},
			_removeCells: function() {
				for(var a in this._cells) {
					var b = this._cells[a].bounds,
						c = this._cells[a].coords;
					this.cellLeave && this.cellLeave(b, c), this.fire("cellleave", {
						bounds: b,
						coords: c
					})
				}
			},
			_addCell: function(a) {
				this._wrapCoords(a);
				var b = this._cellCoordsToKey(a),
					c = this._cells[b];
				c && !this._activeCells[b] && (this.cellEnter && this.cellEnter(c.bounds, a), this.fire("cellenter", {
					bounds: c.bounds,
					coords: a
				}), this._activeCells[b] = c), c || (c = {
					coords: a,
					bounds: this._cellCoordsToBounds(a)
				}, this._cells[b] = c, this._activeCells[b] = c, this.createCell && this.createCell(c.bounds, a), this.fire("cellcreate", {
					bounds: c.bounds,
					coords: a
				}))
			},
			_wrapCoords: function(a) {
				a.x = this._wrapLng ? L.Util.wrapNum(a.x, this._wrapLng) : a.x, a.y = this._wrapLat ? L.Util.wrapNum(a.y, this._wrapLat) : a.y
			}
		}),
		function(a) {
			function b(a) {
				this.values = a || []
			}
			a.Layers.FeatureManager = a.Layers.FeatureGrid.extend({
				options: {
					where: "1=1",
					fields: ["*"],
					from: !1,
					to: !1,
					timeField: !1,
					timeFilterMode: "server",
					simplifyFactor: 0,
					precision: 6
				},
				initialize: function(c) {
					if(a.Layers.FeatureGrid.prototype.initialize.call(this, c), c.url = a.Util.cleanUrl(c.url), c = L.setOptions(this, c), this._service = new a.Services.FeatureLayerService(c), "*" !== this.options.fields[0]) {
						for(var d = !1, e = 0; e < this.options.fields.length; e++) this.options.fields[e].match(/^(OBJECTID|FID|OID|ID)$/i) && (d = !0);
						d === !1 && a.Util.warn("no known esriFieldTypeOID field detected in fields Array.  Please add an attribute field containing unique IDs to ensure the layer can be drawn correctly.")
					}
					this._service.on("authenticationrequired requeststart requestend requesterror requestsuccess", function(a) {
						a = L.extend({
							target: this
						}, a), this.fire(a.type, a)
					}, this), this.options.timeField.start && this.options.timeField.end ? (this._startTimeIndex = new b, this._endTimeIndex = new b) : this.options.timeField && (this._timeIndex = new b), this._cache = {}, this._currentSnapshot = [], this._activeRequests = 0, this._pendingRequests = []
				},
				onAdd: function(b) {
					return a.Layers.FeatureGrid.prototype.onAdd.call(this, b)
				},
				onRemove: function(b) {
					return a.Layers.FeatureGrid.prototype.onRemove.call(this, b)
				},
				getAttribution: function() {
					return this.options.attribution
				},
				createCell: function(a, b) {
					this._requestFeatures(a, b)
				},
				_requestFeatures: function(b, c, d) {
					this._activeRequests++, 1 === this._activeRequests && this.fire("loading", {
						bounds: b
					}), this._buildQuery(b).run(function(e, f, g) {
						g && g.exceededTransferLimit && this.fire("drawlimitexceeded"), !e && f && f.features.length && a.Util.requestAnimationFrame(L.Util.bind(function() {
							this._addFeatures(f.features, c), this._postProcessFeatures(b)
						}, this)), e || !f || f.features.length || this._postProcessFeatures(b), d && d.call(this, e, f)
					}, this)
				},
				_postProcessFeatures: function(a) {
					this._activeRequests--, this._activeRequests <= 0 && this.fire("load", {
						bounds: a
					})
				},
				_cacheKey: function(a) {
					return a.z + ":" + a.x + ":" + a.y
				},
				_addFeatures: function(a, b) {
					var c = this._cacheKey(b);
					this._cache[c] = this._cache[c] || [];
					for(var d = a.length - 1; d >= 0; d--) {
						var e = a[d].id;
						this._currentSnapshot.push(e), this._cache[c].push(e)
					}
					this.options.timeField && this._buildTimeIndexes(a);
					var f = this._map.getZoom();
					f > this.options.maxZoom || f < this.options.minZoom || this.createLayers(a)
				},
				_buildQuery: function(a) {
					var b = this._service.query().intersects(a).where(this.options.where).fields(this.options.fields).precision(this.options.precision);
					return this.options.simplifyFactor && b.simplify(this._map, this.options.simplifyFactor), "server" === this.options.timeFilterMode && this.options.from && this.options.to && b.between(this.options.from, this.options.to), b
				},
				setWhere: function(b, c, d) {
					this.options.where = b && b.length ? b : "1=1";
					for(var e = [], f = [], g = 0, h = null, i = L.Util.bind(function(b, i) {
							if(g--, b && (h = b), i)
								for(var j = i.features.length - 1; j >= 0; j--) f.push(i.features[j].id);
							0 >= g && (this._currentSnapshot = f, a.Util.requestAnimationFrame(L.Util.bind(function() {
								this.removeLayers(e), this.addLayers(f), c && c.call(d, h)
							}, this)))
						}, this), j = this._currentSnapshot.length - 1; j >= 0; j--) e.push(this._currentSnapshot[j]);
					for(var k in this._activeCells) {
						g++;
						var l = this._keyToCellCoords(k),
							m = this._cellCoordsToBounds(l);
						this._requestFeatures(m, k, i)
					}
					return this
				},
				getWhere: function() {
					return this.options.where
				},
				getTimeRange: function() {
					return [this.options.from, this.options.to]
				},
				setTimeRange: function(a, b, c, d) {
					var e = this.options.from,
						f = this.options.to,
						g = 0,
						h = null,
						i = L.Util.bind(function(i) {
							i && (h = i), this._filterExistingFeatures(e, f, a, b), g--, c && 0 >= g && c.call(d, h)
						}, this);
					if(this.options.from = a, this.options.to = b, this._filterExistingFeatures(e, f, a, b), "server" === this.options.timeFilterMode)
						for(var j in this._activeCells) {
							g++;
							var k = this._keyToCellCoords(j),
								l = this._cellCoordsToBounds(k);
							this._requestFeatures(l, j, i)
						}
				},
				refresh: function() {
					for(var a in this._activeCells) {
						var b = this._keyToCellCoords(a),
							c = this._cellCoordsToBounds(b);
						this._requestFeatures(c, a)
					}
					this.redraw && this.once("load", function() {
						this.eachFeature(function(a) {
							this._redraw(a.feature.id)
						}, this)
					}, this)
				},
				_filterExistingFeatures: function(b, c, d, e) {
					var f = b && c ? this._getFeaturesInTimeRange(b, c) : this._currentSnapshot,
						g = this._getFeaturesInTimeRange(d, e);
					if(g.indexOf)
						for(var h = 0; h < g.length; h++) {
							var i = f.indexOf(g[h]);
							i >= 0 && f.splice(i, 1)
						}
					a.Util.requestAnimationFrame(L.Util.bind(function() {
						this.removeLayers(f), this.addLayers(g)
					}, this))
				},
				_getFeaturesInTimeRange: function(a, b) {
					var c, d = [];
					if(this.options.timeField.start && this.options.timeField.end) {
						var e = this._startTimeIndex.between(a, b),
							f = this._endTimeIndex.between(a, b);
						c = e.concat(f)
					} else c = this._timeIndex.between(a, b);
					for(var g = c.length - 1; g >= 0; g--) d.push(c[g].id);
					return d
				},
				_buildTimeIndexes: function(a) {
					var b, c;
					if(this.options.timeField.start && this.options.timeField.end) {
						var d = [],
							e = [];
						for(b = a.length - 1; b >= 0; b--) c = a[b], d.push({
							id: c.id,
							value: new Date(c.properties[this.options.timeField.start])
						}), e.push({
							id: c.id,
							value: new Date(c.properties[this.options.timeField.end])
						});
						this._startTimeIndex.bulkAdd(d), this._endTimeIndex.bulkAdd(e)
					} else {
						var f = [];
						for(b = a.length - 1; b >= 0; b--) c = a[b], f.push({
							id: c.id,
							value: new Date(c.properties[this.options.timeField])
						});
						this._timeIndex.bulkAdd(f)
					}
				},
				_featureWithinTimeRange: function(a) {
					if(!this.options.from || !this.options.to) return !0;
					var b = +this.options.from.valueOf(),
						c = +this.options.to.valueOf();
					if("string" == typeof this.options.timeField) {
						var d = +a.properties[this.options.timeField];
						return d >= b && c >= d
					}
					if(this.options.timeField.start && this.options.timeField.end) {
						var e = +a.properties[this.options.timeField.start],
							f = +a.properties[this.options.timeField.end];
						return e >= b && c >= e || f >= b && c >= f
					}
				},
				authenticate: function(a) {
					return this._service.authenticate(a), this
				},
				metadata: function(a, b) {
					return this._service.metadata(a, b), this
				},
				query: function() {
					return this._service.query()
				},
				_getMetadata: function(a) {
					if(this._metadata) {
						var b;
						a(b, this._metadata)
					} else this.metadata(L.Util.bind(function(b, c) {
						this._metadata = c, a(b, this._metadata)
					}, this))
				},
				addFeature: function(a, b, c) {
					this._getMetadata(L.Util.bind(function(d, e) {
						this._service.addFeature(a, L.Util.bind(function(d, f) {
							d || (a.properties[e.objectIdField] = f.objectId, a.id = f.objectId, this.createLayers([a])), b && b.call(c, d, f)
						}, this))
					}, this))
				},
				updateFeature: function(a, b, c) {
					this._service.updateFeature(a, function(d, e) {
						d || (this.removeLayers([a.id], !0), this.createLayers([a])), b && b.call(c, d, e)
					}, this)
				},
				deleteFeature: function(a, b, c) {
					this._service.deleteFeature(a, function(a, d) {
						!a && d.objectId && this.removeLayers([d.objectId], !0), b && b.call(c, a, d)
					}, this)
				},
				deleteFeatures: function(a, b, c) {
					return this._service.deleteFeatures(a, function(a, d) {
						if(!a && d.length > 0)
							for(var e = 0; e < d.length; e++) this.removeLayers([d[e].objectId], !0);
						b && b.call(c, a, d)
					}, this)
				}
			}), b.prototype._query = function(a) {
				for(var b, c, d, e = 0, f = this.values.length - 1; f >= e;)
					if(d = b = (e + f) / 2 | 0, c = this.values[Math.round(b)], +c.value < +a) e = b + 1;
					else {
						if(!(+c.value > +a)) return b;
						f = b - 1
					}
				return ~f
			}, b.prototype.sort = function() {
				this.values.sort(function(a, b) {
					return +b.value - +a.value
				}).reverse(), this.dirty = !1
			}, b.prototype.between = function(a, b) {
				this.dirty && this.sort();
				var c = this._query(a),
					d = this._query(b);
				return 0 === c && 0 === d ? [] : (c = Math.abs(c), d = 0 > d ? Math.abs(d) : d + 1, this.values.slice(c, d))
			}, b.prototype.bulkAdd = function(a) {
				this.dirty = !0, this.values = this.values.concat(a)
			}
		}(EsriLeaflet), EsriLeaflet.Layers.FeatureLayer = EsriLeaflet.Layers.FeatureManager.extend({
			statics: {
				EVENTS: "click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose"
			},
			options: {
				cacheLayers: !0
			},
			initialize: function(a) {
				EsriLeaflet.Layers.FeatureManager.prototype.initialize.call(this, a), a = L.setOptions(this, a), this._layers = {}, this._leafletIds = {}, this._key = "c" + (1e9 * Math.random()).toString(36).replace(".", "_")
			},
			onAdd: function(a) {
				return a.on("zoomstart zoomend", function(a) {
					this._zooming = "zoomstart" === a.type
				}, this), EsriLeaflet.Layers.FeatureManager.prototype.onAdd.call(this, a)
			},
			onRemove: function(a) {
				for(var b in this._layers) a.removeLayer(this._layers[b]);
				return EsriLeaflet.Layers.FeatureManager.prototype.onRemove.call(this, a)
			},
			createNewLayer: function(a) {
				return L.GeoJSON.geometryToLayer(a, this.options.pointToLayer, L.GeoJSON.coordsToLatLng, this.options)
			},
			_updateLayer: function(a, b) {
				var c = [],
					d = this.options.coordsToLatLng || L.GeoJSON.coordsToLatLng;
				switch(b.properties && (a.feature.properties = b.properties), b.geometry.type) {
					case "Point":
						c = L.GeoJSON.coordsToLatLng(b.geometry.coordinates), a.setLatLng(c);
						break;
					case "LineString":
						c = L.GeoJSON.coordsToLatLngs(b.geometry.coordinates, 0, d), a.setLatLngs(c);
						break;
					case "MultiLineString":
						c = L.GeoJSON.coordsToLatLngs(b.geometry.coordinates, 1, d), a.setLatLngs(c);
						break;
					case "Polygon":
						c = L.GeoJSON.coordsToLatLngs(b.geometry.coordinates, 1, d), a.setLatLngs(c);
						break;
					case "MultiPolygon":
						c = L.GeoJSON.coordsToLatLngs(b.geometry.coordinates, 2, d), a.setLatLngs(c)
				}
			},
			createLayers: function(a) {
				for(var b = a.length - 1; b >= 0; b--) {
					var c, d = a[b],
						e = this._layers[d.id];
					e && !this._map.hasLayer(e) && this._map.addLayer(e), e && (e.setLatLngs || e.setLatLng) && this._updateLayer(e, d), e || (c = this.createNewLayer(d), c.feature = d, this.options.style ? c._originalStyle = this.options.style : c.setStyle && (c._originalStyle = c.options), c._leaflet_id = this._key + "_" + d.id, this._leafletIds[c._leaflet_id] = d.id, c.on(EsriLeaflet.Layers.FeatureLayer.EVENTS, this._propagateEvent, this), this._popup && c.bindPopup && c.bindPopup(this._popup(c.feature, c), this._popupOptions), this.options.onEachFeature && this.options.onEachFeature(c.feature, c), this._layers[c.feature.id] = c, this.resetStyle(c.feature.id), this.fire("createfeature", {
						feature: c.feature
					}), (!this.options.timeField || this.options.timeField && this._featureWithinTimeRange(d)) && this._map.addLayer(c))
				}
			},
			addLayers: function(a) {
				for(var b = a.length - 1; b >= 0; b--) {
					var c = this._layers[a[b]];
					c && (this.fire("addfeature", {
						feature: c.feature
					}), this._map.addLayer(c))
				}
			},
			removeLayers: function(a, b) {
				for(var c = a.length - 1; c >= 0; c--) {
					var d = a[c],
						e = this._layers[d];
					e && (this.fire("removefeature", {
						feature: e.feature,
						permanent: b
					}), this._map.removeLayer(e)), e && b && delete this._layers[d]
				}
			},
			cellEnter: function(a, b) {
				this._zooming || EsriLeaflet.Util.requestAnimationFrame(L.Util.bind(function() {
					var a = this._cacheKey(b),
						c = this._cellCoordsToKey(b),
						d = this._cache[a];
					this._activeCells[c] && d && this.addLayers(d)
				}, this))
			},
			cellLeave: function(a, b) {
				this._zooming || EsriLeaflet.Util.requestAnimationFrame(L.Util.bind(function() {
					var a = this._cacheKey(b),
						c = this._cellCoordsToKey(b),
						d = this._cache[a],
						e = this._map.getBounds();
					if(!this._activeCells[c] && d) {
						for(var f = !0, g = 0; g < d.length; g++) {
							var h = this._layers[d[g]];
							h && h.getBounds && e.intersects(h.getBounds()) && (f = !1)
						}
						f && this.removeLayers(d, !this.options.cacheLayers), !this.options.cacheLayers && f && (delete this._cache[a], delete this._cells[c], delete this._activeCells[c])
					}
				}, this))
			},
			resetStyle: function(a) {
				var b = this._layers[a];
				return b && this.setFeatureStyle(b.feature.id, b._originalStyle), this
			},
			setStyle: function(a) {
				return this.options.style = a, this.eachFeature(function(b) {
					this.setFeatureStyle(b.feature.id, a)
				}, this), this
			},
			setFeatureStyle: function(a, b) {
				var c = this._layers[a];
				return "function" == typeof b && (b = b(c.feature)), b || c.defaultOptions || (b = L.Path.prototype.options, b.fill = !0), c && c.setStyle && c.setStyle(b), this
			},
			bindPopup: function(a, b) {
				this._popup = a, this._popupOptions = b;
				for(var c in this._layers) {
					var d = this._layers[c],
						e = this._popup(d.feature, d);
					d.bindPopup(e, b)
				}
				return this
			},
			unbindPopup: function() {
				this._popup = !1;
				for(var a in this._layers) {
					var b = this._layers[a];
					if(b.unbindPopup) b.unbindPopup();
					else if(b.getLayers) {
						var c = b.getLayers();
						for(var d in c) {
							var e = c[d];
							e.unbindPopup()
						}
					}
				}
				return this
			},
			eachFeature: function(a, b) {
				for(var c in this._layers) a.call(b, this._layers[c]);
				return this
			},
			getFeature: function(a) {
				return this._layers[a]
			},
			bringToBack: function() {
				this.eachFeature(function(a) {
					a.bringToBack && a.bringToBack()
				})
			},
			bringToFront: function() {
				this.eachFeature(function(a) {
					a.bringToFront && a.bringToFront()
				})
			},
			redraw: function(a) {
				return a && this._redraw(a), this
			},
			_redraw: function(a) {
				var b = this._layers[a],
					c = b.feature;
				if(b && b.setIcon && this.options.pointToLayer && this.options.pointToLayer) {
					var d = this.options.pointToLayer(c, L.latLng(c.geometry.coordinates[1], c.geometry.coordinates[0])),
						e = d.options.icon;
					b.setIcon(e)
				}
				if(b && b.setStyle && this.options.pointToLayer) {
					var f = this.options.pointToLayer(c, L.latLng(c.geometry.coordinates[1], c.geometry.coordinates[0])),
						g = f.options;
					this.setFeatureStyle(c.id, g)
				}
				b && b.setStyle && this.options.style && this.resetStyle(c.id)
			},
			_propagateEvent: function(a) {
				a.layer = this._layers[this._leafletIds[a.target._leaflet_id]], a.target = this, this.fire(a.type, a)
			}
		}), EsriLeaflet.FeatureLayer = EsriLeaflet.Layers.FeatureLayer, EsriLeaflet.Layers.featureLayer = function(a) {
			return new EsriLeaflet.Layers.FeatureLayer(a)
		}, EsriLeaflet.featureLayer = function(a) {
			return new EsriLeaflet.Layers.FeatureLayer(a)
		}, EsriLeaflet.Controls.Logo = L.Control.extend({
			options: {
				position: "bottomright",
				marginTop: 0,
				marginLeft: 0,
				marginBottom: 0,
				marginRight: 0
			},
			onAdd: function() {
				var a = L.DomUtil.create("div", "esri-leaflet-logo");
				return a.style.marginTop = this.options.marginTop, a.style.marginLeft = this.options.marginLeft, a.style.marginBottom = this.options.marginBottom, a.style.marginRight = this.options.marginRight, a.innerHTML = this._adjustLogo(this._map._size), this._map.on("resize", function(b) {
					a.innerHTML = this._adjustLogo(b.newSize)
				}, this), a
			},
			_adjustLogo: function(a) {
				return a.x <= 600 || a.y <= 600 ? '<a href="https://developers.arcgis.com" style="border: none;"><img src="https://js.arcgis.com/3.13/esri/images/map/logo-sm.png" alt="Powered by Esri" style="border: none;"></a>' : '<a href="https://developers.arcgis.com" style="border: none;"><img src="https://js.arcgis.com/3.13/esri/images/map/logo-med.png" alt="Powered by Esri" style="border: none;"></a>'
			}
		}), EsriLeaflet.Controls.logo = function(a) {
			return new L.esri.Controls.Logo(a)
		};
	//# sourceMappingURL=esri-leaflet.js.map

	return EsriLeaflet;
}));