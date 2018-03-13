var mapServicePanelHeight = 638;
var zoomout = false;
var complate;
var centerMarker;
var centerMarkes;
var map, layer, animatorVector, drawLine, lineLayer, drawPolygon, polygonLayer, vectorLayer, pathLayer,qinwuMarkers;
var selectFeature;
var popup, popupflag = false;
var i = 0,
j = 0,
pathTime;
var AnalysisLayer = null;
var AnalysisPlace = null;
var AnalysisCode = null;
var car2;
var styleLine = {
    strokeColor: "#304DBE",
    strokeWidth: 3,
    pointerEvents: "visiblePainted",
    fill: false
};
var yuanstyle = {
    strokeColor: "red",
    strokeWidth: 2,
    pointerEvents: "visiblePainted",
    fill: false
};
var styleCar;
var styleCar1 = {
    externalGraphic: "./images/trnsp_ent_path.png",
    allowRotate: true,
    graphicWidth: 18,
    graphicHeight: 45
},
styleCar2 = {
    externalGraphic: "./images/police_path.png",
    allowRotate: true,
    graphicWidth: 18,
    graphicHeight: 45
},
styleCar3 = {
    externalGraphic: "./images/firealarm_path.png",
    allowRotate: true,
    graphicWidth: 18,
    graphicHeight: 45
},
styleCar4 = {
    externalGraphic: "./images/surviliance_path.png",
    allowRotate: true,
    graphicWidth: 18,
    graphicHeight: 45
},
styleCar5 = {
    externalGraphic: "./images/redCar_path.png",
    allowRotate: true,
    graphicWidth: 18,
    graphicHeight: 45
};
var styleDrawLine = {
    strokeColor: "gray",
    strokeWidth: 2,
    pointerEvents: "visiblePainted",
    fillColor: "gray",
    fillOpacity: 1
};
var styleDrawPolygon = {
    strokeColor: "gray",
    strokeWidth: 2,
    pointerEvents: "visiblePainted",
    fillColor: "#cecece",
    fillOpacity: 0.8
};
var yuanvectorLayer;
var url = "http://localhost:8090/iserver/services/map-sichuan/rest/maps/sichuan";
var urltdt = "http://localhost:8090/iserver/services/map-tianditu/rest/maps/影像底图_经纬度";
var dataurl = "http://localhost:8090/iserver/services/data-sichuan/rest/data";
var neturl = "http://localhost:8090/iserver/services/transportationAnalyst-sichuan/rest/networkanalyst/NetDT@sichuan";
var mapLocationPanle = true;
var currentPoint, targetPoint;
var pathNodeArray = new Array();
Ext.onReady(function() {
    pageInit();
    initIconDeploymentArea1()
});
function pageInit() {
    pageLayout();
    OnPageLoad();
    initNavigationControl();
}
function gdzqdHandler() {
    qinwuMarkers.clearMarkers();
    var chunxilu = new SuperMap.Geometry.Point(104.07760, 30.65640);
    var tianfuSquer = new SuperMap.Geometry.Point(104.06532,30.65738);
    var jingliubg = new SuperMap.Geometry.Point(104.07527,30.67079);
    var shuangliujc = new SuperMap.Geometry.Point(103.95837, 30.57890);
    var hqzx = new SuperMap.Geometry.Point(104.06575, 30.56841);
    var hcbz = new SuperMap.Geometry.Point(104.08067, 30.69574);
    var hcdz = new SuperMap.Geometry.Point(104.14379, 30.62745);
    var hcnz = new SuperMap.Geometry.Point(104.06499, 30.60606);
    var shengzf = new SuperMap.Geometry.Point(104.07587, 30.65092);
    var shengzw = new SuperMap.Geometry.Point(104.06200, 30.65272);
    var A = Ext.getCmp("commandPostCheckBox");
    var m = [];
    m.push(chunxilu.x);
    m.push(tianfuSquer.x);
    m.push(jingliubg.x);
    m.push(shuangliujc.x);
    m.push(hqzx.x);
    m.push(hcbz.x);
    m.push(hcdz.x);
    m.push(hcnz.x);
    m.push(shengzf.x);
    m.push(shengzw).x;
    var l = [];
    l.push(chunxilu.y);
    l.push(tianfuSquer.y);
    l.push(jingliubg.y);
    l.push(shuangliujc.y);
    l.push(hqzx.y);
    l.push(hcbz.y);
    l.push(hcdz.y);
    l.push(hcnz.y);
    l.push(shengzf.y);
    l.push(shengzw).y;
    if (A.getValue()) {
        var r = new SuperMap.Size(21, 25);
        var f = new SuperMap.Pixel( - (r.w / 2), -r.h);
        var w = new SuperMap.Icon("./images/gangshao.png", r, f);
        var len = m.length;
        for (var i = 0; i < len; i++) {
            var h = new SuperMap.Marker(new SuperMap.LonLat(m[i], l[i]), w);
            h.events.on({
                "click": qinwuMarkerInfo
            });
            qinwuMarkers.addMarker(h);
        }
    } else {
        qinwuMarkers.clearMarkers();
        vectorLayer.removeAllFeatures();
        closeInfoWin();
    }
}
function zqfwHandler() {
    var A = Ext.getCmp("alarmCheckBox");
    var B = Ext.getCmp("commandPostCheckBox").getValue();
    if (!B) {
        Ext.MessageBox.alert("系 统 提 示", "您 未 选 择 执 勤 地 点 ! ");
        return;
    }
    if (A.getValue()) {
    /*实时岗哨区域*/
    var points1=[
        new SuperMap.Geometry.Point(104.06569, 30.65623),
        new SuperMap.Geometry.Point(104.06582, 30.65635),
        new SuperMap.Geometry.Point(104.06569, 30.65636),
        new SuperMap.Geometry.Point(104.06605, 30.65625),
        
        new SuperMap.Geometry.Point(104.06612, 30.65631),
        new SuperMap.Geometry.Point(104.06736, 30.65637),
        new SuperMap.Geometry.Point(104.06753, 30.65662),
        new SuperMap.Geometry.Point(104.06753, 30.65882),
        
        new SuperMap.Geometry.Point(104.06742, 30.65842),
        new SuperMap.Geometry.Point(104.06588, 30.65841),
        new SuperMap.Geometry.Point(104.06418, 30.65834),
        new SuperMap.Geometry.Point(104.06420, 30.65643),
        new SuperMap.Geometry.Point(104.06431, 30.65629)
    ],
        points2 = [
        new SuperMap.Geometry.Point(104.07405, 30.65421),
        new SuperMap.Geometry.Point(104.07505, 30.65559),
        new SuperMap.Geometry.Point(104.07629, 30.65719),
        new SuperMap.Geometry.Point(104.07713, 30.65843),
        new SuperMap.Geometry.Point(104.07704, 30.65871),
        new SuperMap.Geometry.Point(104.07726, 30.65870),
        new SuperMap.Geometry.Point(104.07878, 30.65806),
        new SuperMap.Geometry.Point(104.07983, 30.65754),
        new SuperMap.Geometry.Point(104.08162, 30.65666),
        new SuperMap.Geometry.Point(104.07987, 30.65421),
        new SuperMap.Geometry.Point(104.07841, 30.65212),
        new SuperMap.Geometry.Point(104.07591, 30.65332)
        ],
        points3 = [
        new SuperMap.Geometry.Point(104.07482, 30.65202),
        new SuperMap.Geometry.Point(104.07443, 30.65154),
        new SuperMap.Geometry.Point(104.07420, 30.65154),
        new SuperMap.Geometry.Point(104.07375, 30.65077),
        new SuperMap.Geometry.Point(104.07272, 30.65128),
        new SuperMap.Geometry.Point(104.07187, 30.65021),
        new SuperMap.Geometry.Point(104.07178, 30.64997),
        new SuperMap.Geometry.Point(104.07274, 30.64921),
        new SuperMap.Geometry.Point(104.07329, 30.64890),
        new SuperMap.Geometry.Point(104.07547, 30.64821),
        new SuperMap.Geometry.Point(104.07712, 30.65066),  
        new SuperMap.Geometry.Point(104.07748, 30.65093),
        ],
        points4 = [
        new SuperMap.Geometry.Point(104.07396, 30.66964),
        new SuperMap.Geometry.Point(104.07608, 30.67264),
        new SuperMap.Geometry.Point(104.07791, 30.67174),
        new SuperMap.Geometry.Point(104.07589, 30.66873)
        ],
        points5 = [
        new SuperMap.Geometry.Point(103.96035, 30.57289),
        new SuperMap.Geometry.Point(103.95989, 30.57529),
        new SuperMap.Geometry.Point(103.96217, 30.58042),
        new SuperMap.Geometry.Point(103.96263, 30.58339),
        new SuperMap.Geometry.Point(103.96183, 30.58390),
        new SuperMap.Geometry.Point(103.96160, 30.58478),
        new SuperMap.Geometry.Point(103.96183, 30.58598),
        new SuperMap.Geometry.Point(103.96068, 30.58680),
        new SuperMap.Geometry.Point(103.96148, 30.58596),
        new SuperMap.Geometry.Point(103.96045, 30.58332),
        new SuperMap.Geometry.Point(103.95983, 30.58350),
        new SuperMap.Geometry.Point(103.95600, 30.57472)
        ];
    var linearRings1 = new SuperMap.Geometry.LinearRing(points1),
        region1 = new SuperMap.Geometry.Polygon([linearRings1]),
        polygonVector1 = new SuperMap.Feature.Vector(region1);
        polygonVector1.style = {
            strokeColor: "gray",
            fillColor: "#FF0000",
            fillOpacity: 0.6
        };
    var linearRings2 = new SuperMap.Geometry.LinearRing(points2),
        region2 = new SuperMap.Geometry.Polygon([linearRings2]),
        polygonVector2 = new SuperMap.Feature.Vector(region2);
        polygonVector2.style = {
            strokeColor: "gray",
            fillColor: "#FF0000",
            fillOpacity: 0.6
        };
    var linearRings3 = new SuperMap.Geometry.LinearRing(points3),
        region3 = new SuperMap.Geometry.Polygon([linearRings3]),
        polygonVector3 = new SuperMap.Feature.Vector(region3);
        polygonVector3.style = {
            strokeColor: "gray",
            fillColor: "#FF0000",
            fillOpacity: 0.6
        };
    var linearRings4 = new SuperMap.Geometry.LinearRing(points4),
        region4 = new SuperMap.Geometry.Polygon([linearRings4]),
        polygonVector4 = new SuperMap.Feature.Vector(region4);
        polygonVector4.style = {
            strokeColor: "gray",
            fillColor: "#FF0000",
            fillOpacity: 0.6
        };
    var linearRings5 = new SuperMap.Geometry.LinearRing(points5),
        region5 = new SuperMap.Geometry.Polygon([linearRings5]),
        polygonVector5 = new SuperMap.Feature.Vector(region5);
        polygonVector5.style = {
            strokeColor: "gray",
            fillColor: "#FF0000",
            fillOpacity: 0.6
        };
        vectorLayer.addFeatures([
            polygonVector1, 
            polygonVector2, 
            polygonVector3, 
            polygonVector4,
            polygonVector5
        ]);
    } else {
        vectorLayer.removeAllFeatures();
    }
}
function qinwuMarkerVideo() {
    /*拿到视频地址*/
    var src = randomSrcQw().src;
    closeInfoWin();
    var popup = new SuperMap.Popup("chicken", mouselonlat, new SuperMap.Size(310, 210), src, true, null);
    popup.setBorder("solid 2px #c1c1c1");
    popup.panMapIfOutOfView = true;
    infowin = popup;
    map.addPopup(popup)
}
function randomSrcQw() {
    var random = Math.round(Math.random()*2 + 1);
    var video = new Object();
    video.src = null;
    switch (random) {
        case 1 :
        video.src = '<video autoplay="autoplay" src="./resource/dutyVideo/duty_1.webm" width="100%" height="195" controls></video>';
        break;
        case 2 :
        video.src = '<video autoplay="autoplay" src="./resource/dutyVideo/duty_2.webm" width="100%" height="195" controls></video>';
        break;
        default : 
        video.src = '<video autoplay="autoplay" src="./resource/dutyVideo/duty_3.webm" width="100%" height="195" controls></video>';
    }
    return video;
}
function qinwuMarkerInfo() {
    closeInfoWin();
    var A = randomObject().num;
    var B = Math.floor(Math.random()*(150-50+1)+50) + "人";
    var C = randomObject().phone;
    var contentHTML = initQwInfo(A, B, C);
    var framedCloud = new SuperMap.Popup.FramedCloud(
        "chicken", 
        mouselonlat,
        null,
        contentHTML,
        null,
        true,
        null,
        true
    );
    infowin = framedCloud;
    map.addPopup(framedCloud);
}
function jkspHandler() {
    qinwuMarkers.clearMarkers();
    var chunxilu = new SuperMap.Geometry.Point(104.07760, 30.65640);
    var tianfuSquer = new SuperMap.Geometry.Point(104.06532,30.65738);
    var jingliubg = new SuperMap.Geometry.Point(104.07527,30.67079);
    var shuangliujc = new SuperMap.Geometry.Point(103.95837, 30.57890);
    var hqzx = new SuperMap.Geometry.Point(104.06575, 30.56841);
    var hcbz = new SuperMap.Geometry.Point(104.08067, 30.69574);
    var hcdz = new SuperMap.Geometry.Point(104.14379, 30.62745);
    var hcnz = new SuperMap.Geometry.Point(104.06499, 30.60606);
    var shengzf = new SuperMap.Geometry.Point(104.07587, 30.65092);
    var shengzw = new SuperMap.Geometry.Point(104.06200, 30.65272);
    var A = Ext.getCmp("jiankongCheckBox");
    var m = [];
    m.push(chunxilu.x);
    m.push(tianfuSquer.x);
    m.push(jingliubg.x);
    m.push(shuangliujc.x);
    m.push(hqzx.x);
    m.push(hcbz.x);
    m.push(hcdz.x);
    m.push(hcnz.x);
    m.push(shengzf.x);
    m.push(shengzw).x;
    var l = [];
    l.push(chunxilu.y);
    l.push(tianfuSquer.y);
    l.push(jingliubg.y);
    l.push(shuangliujc.y);
    l.push(hqzx.y);
    l.push(hcbz.y);
    l.push(hcdz.y);
    l.push(hcnz.y);
    l.push(shengzf.y);
    l.push(shengzw).y;
    if (A.getValue()) {
        var r = new SuperMap.Size(21, 25);
        var f = new SuperMap.Pixel( - (r.w / 2), -r.h);
        var w = new SuperMap.Icon("./images/jksp.png", r, f);
        var len = m.length;
        for (var i = 0; i < len; i++) {
            var h = new SuperMap.Marker(new SuperMap.LonLat(m[i], l[i]), w);
            h.events.on({
                "click": qinwuMarkerVideo
            });
            qinwuMarkers.addMarker(h);
        }
    } else {
        qinwuMarkers.clearMarkers();
        vectorLayer.removeAllFeatures();
        closeInfoWin();
    }
}
function randomObject() {
    var randomO = new Object();
    randomO.phone = "1";
    randomO.num = "";
    var random = Math.floor(Math.random()*(4-1+1)+1);
    switch(random) {
        case 1:
            randomO.phone += "3";
            randomO.num += "一中队";
            break;
        case 2:
            randomO.phone += "5";
            randomO.num += "二中队";
            break;
        case 3:
            randomO.phone += "7";
            randomO.num += "三中队";
            break;
        default:
            randomO.phone += "8";
            randomO.num += "四中队";
    }
    for (var i = 0; i < 9; i++) {
        var num = Math.floor(Math.random()*(9-0+1)+0);
        randomO.phone += num;
    }
    return randomO;
}
function initQwInfo(zd, bl, dh) {
    var contentHTML = "<div style='width:160px; height:100px;'><table class='zqInfo' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td>" + "执勤中队:"  + "</td><td>" + zd + "</td></tr>" + "<tr><td>" + "执勤兵力:" + "</td><td>" + bl + "</td></tr>" + "<tr><td>" + "中队长电话:" + "</td><td>" + dh + "</td></tr>" + "<tr><td id='qwInfoBtn_1' ><input type='button' value='发短信' id='qwBtn_1'/></td><td id='qwInfoBtn_2' ><input type='button' value='打电话' id='qwBtn_2'/></td></tr></tbody></table></div>" ;
    return contentHTML;
}
var comboHanlderValue;
function comboHanlder(b) {
    var a = b.getValue();
    comboHanlderValue = a;
    if (a == "力量部署") {
        $("#iconDeployment-innerCt").empty();
        initIconDeploymentArea1()
    } else {
        if (a == "灾害类型") {
            $("#iconDeployment-innerCt").empty();
            initIconDeploymentArea2()
        }
    }
}
function checkBoxHandler(b) {
    var c = b.id;
    var a = Ext.getCmp(c).getValue();
    if (a == true) {
        Ext.MessageBox.alert("Check Box", b.boxLabel + " checked.")
    }
}
function OnPageLoad() {
    window.setInterval("sendbdbw()", 30 * 1000);
    yuanvectorLayer = new SuperMap.Layer.Vector("CirculaLayer",{displayInLayerSwitcher:false});
    vectorLayer = new SuperMap.Layer.Vector("vactorLayer",{displayInLayerSwitcher:false});
    heatMapLayer = new SuperMap.Layer.HeatMapLayer("HeatMapLayer", {
        "featureWeight": "height",
        "featueRadius": "radius"
    },{displayInLayerSwitcher:false});
    var a = [new SuperMap.REST.ServerColor(170, 255, 0), new SuperMap.REST.ServerColor(255, 204, 0), new SuperMap.REST.ServerColor(255, 153, 0), new SuperMap.REST.ServerColor(255, 51, 0), new SuperMap.REST.ServerColor(255, 0, 0)];
    heatMapLayer.colors = a;
    pathLayer = new SuperMap.Layer.Vector("PathLayer",{displayInLayerSwitcher:false});
    lineLayer = new SuperMap.Layer.Vector("LineLayer",{displayInLayerSwitcher:false});
    lineLayer.style = styleDrawLine;
    drawLine = new SuperMap.Control.DrawFeature(lineLayer, SuperMap.Handler.Path, {
        multi: true
    });
    polygonLayer = new SuperMap.Layer.Vector("PolygonLayer",{displayInLayerSwitcher:false});
    polygonLayer.style = styleDrawPolygon;
    drawPolygon = new SuperMap.Control.DrawFeature(polygonLayer, SuperMap.Handler.Polygon);
    drawLine.events.on({
        "featureadded": drawLineCompleted
    });
    drawPolygon.events.on({
        "featureadded": drawPolygonCompleted
    });
    map = new SuperMap.Map("mapPanel-innerCt", {
        controls: [new SuperMap.Control.LayerSwitcher(), new SuperMap.Control.SelectFeature(), new SuperMap.Control.PanZoomBar(), new SuperMap.Control.DragPan(), new SuperMap.Control.ScaleLine(), new SuperMap.Control.MousePosition(), new SuperMap.Control.Navigation({
            dragPanOptions: {
                enableKinetic: true
            }
        }), drawLine, drawPolygon]
    });
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("矢量地图", url, {
        transparent: true,
        cacheEnabled: true
    },
    {
        maxResolution: "auto",
        scales: [1/1000, 1 / 2000, 1 / 4000, 1 / 6000, 1 / 8000, 1 / 10000, 1/12000, 1 / 14000, 1 / 16000, 1 / 18000,  1/20000, 1/ 25000, 1 / 30000, 1 / 35000, 1 / 40000, 1/45000, 1 / 50000, 1 / 60000, 1/80000, 1 / 4500000, 1 / 12000000]
    });
    layer.events.on({
        "layerInitialized": addLayer
    });
    /*天地图图层*/
    /*tiandituLayer = new SuperMap.Layer.Tianditu();
    tiandituLayer.layerType = "img";*/
    tiandituLayer = new SuperMap.Layer.TiledDynamicRESTLayer("影像地图", urltdt, null, {
        maxResolution: "auto"
    })

    centerMarkes = new SuperMap.Layer.Markers("CenterMarkers",{displayInLayerSwitcher:false});
    qinwuMarkers = new SuperMap.Layer.Markers("qinwuMakers",{displayInLayerSwitcher:false});
    map.addLayer(centerMarkes);
    //addMarker();
    markerIconLayer = new SuperMap.Layer.Markers("Markers",{displayInLayerSwitcher:false});
    map.events.on({
        "click": prepareDeployment
    });
    map.events.on({
        "mousemove": setMousePosition
    })
}
function addLayer() {
    map.addLayers([layer, tiandituLayer, yuanvectorLayer, markerIconLayer, lineLayer, polygonLayer, pathLayer,qinwuMarkers, vectorLayer]);
    map.setCenter(new SuperMap.LonLat(103.065967, 30.25805), 0);
    map.zoomIn();
}
function SendShortMessage() {
    var b = $("#sms_number").val();
    if (b.length < 1) {
        Ext.MessageBox.alert("提 示", "电话号码不能为空 !");
        return
    }
    var a = $("#sms_box").val();
    $("#communicationReceiptPanel-innerCt").append(b + "-消息已发送<br>");
    $("#sms_number").clear();
}
function addMarker() {
    var a = new SuperMap.Size(21, 25);
    var c = new SuperMap.Pixel( - (a.w / 2), -a.h);
    var b = new SuperMap.Icon("./images/marker.png", a, c);
    centerMarker = new SuperMap.Marker(new SuperMap.LonLat(104.065967, 30.65805), b);
    centerMarkes.addMarker(centerMarker)
}
function SelectCity(a) {
    var b;
    switch (a) {
    case "成都":
        b = "'5101%'";
        break;
    case "自贡":
        b = "'5103%'";
        break;
    case "攀枝花":
        b = "'5104%'";
        break;
    case "泸州":
        b = "'5105%'";
        break;
    case "德阳":
        b = "'5106%'";
        break;
    case "绵阳":
        b = "'5107%'";
        break;
    case "广元":
        b = "'5108%'";
        break;
    case "遂宁":
        b = "'5109%'";
        break;
    case "内江":
        b = "'5110%'";
        break;
    case "乐山":
        b = "'5111%'";
        break;
    case "南充":
        b = "'5113%'";
        break;
    case "眉山":
        b = "'5114%'";
        break;
    case "宜宾":
        b = "'5115%'";
        break;
    case "广安":
        b = "'5116%'";
        break;
    case "达州":
        b = "'5117%'";
        break;
    case "雅安":
        b = "'5118%'";
        break;
    case "巴中":
        b = "'5119%'";
        break;
    case "资阳":
        b = "'5120%'";
        break;
    case "阿坝":
        b = "'5132%'";
        break;
    case "甘孜":
        b = "'5133%'";
        break;
    case "凉山":
        b = "'5134%'";
        break;
    default:
        b = "'5101%'";
        break
    }
    return b
}
var Layer = null;
function SetLayerArray(a) {
    Layer = null;
    Layer = new Array();
    var b = new SuperMap.REST.FilterParameter({
        name: "高等院校P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "保险公司P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "餐饮服务P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "道路附属设施P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "地区市政府P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "动物医疗场所P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "飞机场P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "风景名胜P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "公共设施P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "公检法机关P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "公司企业P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "购物服务P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "火车站P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "交通地名P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "交通设施服务P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "金融保险机构P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "科教文化服务P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "摩托车服务P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "汽车服务P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "汽车维修P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "汽车销售P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "桥P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "区县级政府P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "商务住宅P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "生活服务P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "省级政府P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "体育休闲服务P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "小学及幼儿园P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "写字楼P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "行政地名P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "医疗保健服务P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "银行P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "银行相关P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "证券公司P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "政府机关及社会团体P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "中学P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "住宿服务P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "专科医院P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "自动取款机P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "自然地名P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    /*b = new SuperMap.REST.FilterParameter({
        name: "警报器P@四川省",
        attributeFilter: a
    });
    Layer.push(b);*/
    b = new SuperMap.REST.FilterParameter({
        name: "指挥所P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "人防工程P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "重点防护目标P@四川省",
        attributeFilter: a
    });
    Layer.push(b);
    b = new SuperMap.REST.FilterParameter({
        name: "综合医院P@四川省",
        attributeFilter: a
    });
    Layer.push(b)
}
function ClearHighlightAndQuery() {
    $("#communicationReceiptPanel-innerCt").empty();
    yuanvectorLayer.removeAllFeatures();
    centerMarkes.clearMarkers();
    vectorLayer.removeAllFeatures();
    qinwuMarkers.clearMarkers();
    //addMarker();
    map.setCenter(new SuperMap.LonLat(103.065967, 30.25805), 0);
    map.zoomIn();
    var m = document;
    var k = $("#locationCombo-inputEl").val();
    var b = m.getElementById("locationText-inputEl");
    var n = b.value;
    var h = n.length;
    var c = "%";
    for (var d = 0; d < h; d++) {
        c += n.substring(d, d + 1) + "%"
    }
    if (b.value == "") {
        Ext.MessageBox.alert("提 示", "请输入关键字后再进行查询 !");
        return
    }
    var g = SelectCity(k);
    var f = "Name Like '" + c + "' and Code Like " + g;
    var l, e, a;
    SetLayerArray(f);
    e = new SuperMap.REST.QueryBySQLParameters({
        queryParams: Layer,
        expectCount: 10000
    });
    a = new SuperMap.REST.QueryBySQLService(url, {
        eventListeners: {
            "processCompleted": SqlQueryCompleted,
            "processFailed": processFailed
        }
    });
    a.processAsync(e)
}
var centerX = null;
var centerY = null;
var AnalysisGeometry = null;
var shotMessageFlag = false;
function AnalysisaddMarker(a, e) {
    var b = new SuperMap.Size(21, 25);
    var d = new SuperMap.Pixel( - (b.w / 2), -b.h);
    var c = new SuperMap.Icon("./images/marker.png", b, d);
    centerMarkes.removeMarker(centerMarker);
    centerMarker = new SuperMap.Marker(new SuperMap.LonLat(a, e), c);
   /* centerMarker.events.on({
        "click": centerMarkerCallBack
    });*/
    centerMarkes.addMarker(centerMarker);
    //shortMessageFlag = false
}
/*function centerMarkerCallBack() {
    if (shortMessageFlag == true) {
        return
    }
    var a = centerX,
    b = centerY;
    ShortMessage(a, b);
    shortMessageFlag = true
}*/
function SetCenter(b, a, d) {
    AnalysisGeometry = null;
    AnalysisGeometry = b;
    centerX = a;
    centerY = d;
    map.setCenter(new SuperMap.LonLat(centerX, centerY), 0);
    map.zoomIn();
    AnalysisaddMarker(a, d);
    map.zoomTo(8);
}
function SetAnalysisRule(b, c, a) {
    AnalysisLayer = b;
    AnalysisPlace = c;
    AnalysisCode = a
}
var IsFirstSelect = false;
function bgChange(a) {
    if (IsFirstSelect) {
        prvObj.bgColor = ""
    }
    prvObj = a;
    a.bgColor = "c1c1c1";
    IsFirstSelect = true
}
var featureTemp;
function SqlQueryCompleted(f) {
    var g = "<div class='locationDiv'>";
    var a = 1;
    g += ' <table  class="locationTable">';
    g += " <thead><tr>";
    g += "<th class='tableheader'>ID</th><th class='tableheader'>地点名称</th></thead><tbody>";
    var d, c, l, m = f.result;
    if (m && m.recordsets) {
        for (c = 0; c < m.recordsets.length; c++) {
            var h = m.recordsets[c].datasetName;
            if (m.recordsets[c].features) {
                var b = m.recordsets[c].features;
                for (d = 0, len = b.length; d < len; d++) {
                    l = b[d];
                    g += "<tr onclick = bgChange(this);><td>" + "<div style='cursor:hand'  onclick =\"" + "SetCenter('" + l.geometry + "','" + l.geometry.x + "','" + l.geometry.y + "');";
                    g += "SetAnalysisRule('" + h + "','" + l.attributes.Name + "','" + l.attributes.CODE + "');";
                    g += '">';
                    g += a + "</div></td><td>";
                    a++;
                    g += "<div style='cursor:hand'  onclick =\"";
                    g += "SetCenter('" + l.geometry + "','" + l.geometry.x + "','" + l.geometry.y + "');";
                    g += "SetAnalysisRule('" + h + "','" + l.attributes.Name + "','" + l.attributes.CODE + "');";
                    g += '">';
                    g += l.attributes.Name + "</div></td></tr>"
                }
            }
        }
    } else {
        g = "";
        var k = document;
        var e = k.getElementById("queryResultsPanel-innerCt");
        e.innerHTML = g;
        return
    }
    g += "</tbody></table>";
    g += "</div>";
    var k = document;
    var e = k.getElementById("queryResultsPanel-innerCt");
    if (e) {
        e.innerHTML = g
    }
}
function processFailed(a) {
    $("#communicationReceiptPanel-innerCt").empty();
    $("#communicationReceiptPanel-innerCt").css('text-align', 'center');
    $("#communicationReceiptPanel-innerCt").append("查询失败!" + '</br>' + a.error.errorMsg);
}
var AnalysisLayers = null;
function SetAnalysisLayers() {
    AnalysisLayers = null;
    AnalysisLayers = new Array();
    var a = new SuperMap.REST.FilterParameter({
        name: "省级政府P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "地区市政府P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "区县级政府P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "政府机关及社会团体P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "公检法机关P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "医疗保健服务P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "综合医院P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "专科医院P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "动物医疗场所P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "科教文化服务P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "高等院校P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "中学P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "小学及幼儿园P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "天网@sichuan"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "指挥所P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "人防工程P@四川省"
    });
    AnalysisLayers.push(a);
    a = new SuperMap.REST.FilterParameter({
        name: "重点防护目标P@四川省"
    });
    AnalysisLayers.push(a)
}
var zhihuiResult = null;
var jingbaoResult = null;
var renfangResult = null;
var fanghuResult = null;
var zhengfuResult = null;
var gonganResult = null;
var yiyuanResult = null;
var xuexiaoResult = null;
var showResult = null;
var tianwangResult = null;
var mapflag = true;
function ClearAndAnalysis() {
    mapflag = false;
    $("#communicationReceiptPanel-innerCt").empty();
    $("#communicationReceiptPanel-innerCt").css('text-align', 'center');
    $("#communicationReceiptPanel-innerCt").append('缓冲区分析成功!');
    if (AnalysisLayer == null || AnalysisPlace == null || AnalysisCode == null) {
        Ext.MessageBox.alert("提 示", "您未选择缓冲区分析地点 !");
        return
    }
    var l = document;
    var d = l.getElementById("queryResultsPanel-innerCt");
    if (d) {
        d.innerHTML = ""
    }
    centerMarkes.clearMarkers();
    map.removeAllPopup();
    yuanvectorLayer.removeAllFeatures();
    vectorLayer.removeAllFeatures();
    qinwuMarkers.clearMarkers();
    map.setCenter(new SuperMap.LonLat(centerX, centerY), 0);
    map.zoomIn();
    zhihuiResult = null;
    zhihuiResult = new Array();
    jingbaoResult = null;
    jingbaoResult = new Array();
    renfangResult = null;
    renfangResult = new Array();
    fanghuResult = null;
    fanghuResult = new Array();
    zhengfuResult = null;
    zhengfuResult = new Array();
    gonganResult = null;
    gonganResult = new Array();
    yiyuanResult = null;
    yiyuanResult = new Array();
    xuexiaoResult = null;
    xuexiaoResult = new Array();
    tianwangResult = null;
    tianwangResult = new Array();
    showResult = null;
    showResult = new Array();
    var a = null;
    var l = document;
    var f = l.getElementById("bufferAnalysisText-inputEl");
    if (f.value == "") {
        Ext.MessageBox.alert("系统提示", "请输入缓冲区分析半径 !");
        return
    }
    var b = $("#bufferAnalysisCombo-inputEl").val();
    var g = 0;
    if (b == "米") {
        g = f.value / 1000;
        a = g * 0.00833333
    } else {
        g = f.value;
        a = f.value * 0.00833333
    }
    if (g <= 0.1) {
        map.zoomTo(19)
    } else {
        if (g <= 0.4 && g > 0.1) {
            map.zoomTo(18)
        } else {
            if (g <= 0.7 && g > 0.4) {
                map.zoomTo(16)
            } else {
                if (g <= 0.8 && g > 0.7) {
                    map.zoomTo(15)
                } else {
                    if (g <= 1 && g > 0.8) {
                        map.zoomTo(14)
                    } else {
                       if (g <= 3 && g > 1) {
                           map.zoomTo(9)
                       } else {
                           if (g <= 5 && g > 3) {
                               map.zoomTo(5)
                           } else {
                               if (g <= 10 && g > 5) {
                                   map.zoomTo(2)
                               } else {
                                   Ext.MessageBox.alert("系统提示", "缓冲区分析半径不能大于10公里 !");
                               }
                           }
                       }
                    }
                }
            }
        }
    }
    AnalysisaddMarker(centerX, centerY);
    markRoundGeometry(a);
    var e = new SuperMap.Geometry.Point(centerX, centerY);
    SetAnalysisLayers();
    var k = new SuperMap.REST.QueryByDistanceParameters({
        queryParams: AnalysisLayers,
        returnContent: true,
        distance: a,
        expectCount: 10000,
        geometry: e
    });
    var h = new SuperMap.REST.QueryByDistanceService(url);
    h.events.on({
        "processCompleted": AnalysisprocessCompleted,
        "processFailed": AnalysisprocessFailed
    });
    h.processAsync(k)
}
function AnalysisprocessCompleted(d) {
    //$("#communicationReceiptPanel-innerCt").empty();
    var t, s, o = d.result;
    var e;
    var C = document;
    var k = 1;
    for (t = 0; t < o.recordsets.length; t++) {
        var B = o.recordsets[t].datasetName;
        var g = o.recordsets[t].features;
        var v = g.length;
        for (s = 0; s < v; s++) {
            e = g[s];
            var m = e.geometry.x;
            var l = e.geometry.y;
            k++;
            if (e.attributes.Name == AnalysisPlace) {
                continue
            }
            var D = new Object();
            D.Point = e.geometry;
            D.Place = e.attributes.Name;
            D.PointDistance = MeasureDitance(m, l);
            if (B == "天网@sichuan") {
                var a = Ext.getCmp("skynetCheckBox");
                if (a.getValue()) {
                    D.Place = e.attributes.TEL;
                    var r = new SuperMap.Size(21, 25);
                    var f = new SuperMap.Pixel( - (r.w / 2), -r.h);
                    var w = new SuperMap.Icon("./images/skyweb.png", r, f);
                    var h = new SuperMap.Marker(new SuperMap.LonLat(m, l), w); 
                    centerMarkes.addMarker(h);
                    h.events.on({
                            "click": skywebVideo
                    });
                }
                D.Id = 2;
                tianwangResult.push(D)
            } else {
                if (B == "重点防护目标P@四川省") {
                    var q = Ext.getCmp("keyTargetCheckBox");
                    if (q.getValue()) {
                        D.Place = e.attributes.KIND;
                        var r = new SuperMap.Size(21, 25);
                        var f = new SuperMap.Pixel( - (r.w / 2), -r.h);
                        var w = new SuperMap.Icon("./images/protect.png", r, f);
                        var h = new SuperMap.Marker(new SuperMap.LonLat(m, l), w);
                        centerMarkes.addMarker(h);
                        h.events.on({
                            "click": markerInfo
                        });
                        showResult.push(D)
                    }
                    D.Id = 4;
                    fanghuResult.push(D)
                } /*else {
                    if (B == "人防工程P@四川省") {
                        var n = Ext.getCmp("civilDefenseEngineeringCheckBox");
                        if (n.getValue()) {
                            D.Place = e.attributes.STRUCTURE;
                            var r = new SuperMap.Size(21, 25);
                            var f = new SuperMap.Pixel( - (r.w / 2), -r.h);
                            var w = new SuperMap.Icon("./images/project.png", r, f);
                            var h = new SuperMap.Marker(new SuperMap.LonLat(m, l), w);
                            h.events.on({
                                "click": markerInfo
                            });
                            centerMarkes.addMarker(h);
                            //showResult.push(D)
                        }
                        D.Id = 3;
                        renfangResult.push(D)
                    } */else {
                        if (B == "指挥所P@四川省") {
                            var A = Ext.getCmp("commandPostCheckBox");
                            if (A.getValue()) {
                                D.Place = e.attributes.MAINBODY;
                                var r = new SuperMap.Size(21, 25);
                                var f = new SuperMap.Pixel( - (r.w / 2), -r.h);
                                var w = new SuperMap.Icon("./images/command.png", r, f);
                                var h = new SuperMap.Marker(new SuperMap.LonLat(m, l), w);
                                h.events.on({
                                    "click": markerInfo
                                });
                                centerMarkes.addMarker(h);
                                showResult.push(D)
                            }
                            D.Id = 1;
                            zhihuiResult.push(D)
                        } else {
                            if (B == "省级政府P@四川省" || B == "地区市政府P@四川省" || B == "政府机关及社会团体P@四川省" || B == "区县级政府P@四川省") {
                                var u = Ext.getCmp("governmentSectorCheckBox");
                                if (u.getValue()) {
                                    var r = new SuperMap.Size(21, 25);
                                    var f = new SuperMap.Pixel( - (r.w / 2), -r.h);
                                    var w = new SuperMap.Icon("./images/govement.png", r, f);
                                    var h = new SuperMap.Marker(new SuperMap.LonLat(m, l), w);
                                    h.events.on({
                                        "click": markerInfo
                                    });
                                    centerMarkes.addMarker(h);
                                    showResult.push(D)
                                }
                                D.Id = 7;
                                zhengfuResult.push(D)
                            } else {
                                if (B == "公检法机关P@四川省") {
                                    var c = Ext.getCmp("policeFireCheckBox");
                                    if (c.getValue()) {
                                        var r = new SuperMap.Size(21, 25);
                                        var f = new SuperMap.Pixel( - (r.w / 2), -r.h);
                                        var w = new SuperMap.Icon("./images/policefire.png", r, f);
                                        var h = new SuperMap.Marker(new SuperMap.LonLat(m, l), w);
                                        h.events.on({
                                            "click": markerInfo
                                        });
                                        centerMarkes.addMarker(h);
                                        showResult.push(D)
                                    }
                                    D.Id = 8;
                                    gonganResult.push(D)
                                } else {
                                    if (B == "医疗保健服务P@四川省" || B == "综合医院P@四川省" || B == "专科医院P@四川省" || B == "动物医疗场所P@四川省") {
                                        var b = Ext.getCmp("hospitalCheckBox");
                                        if (b.getValue()) {
                                            var r = new SuperMap.Size(21, 25);
                                            var f = new SuperMap.Pixel( - (r.w / 2), -r.h);
                                            var w = new SuperMap.Icon("./images/hospital.png", r, f);
                                            var h = new SuperMap.Marker(new SuperMap.LonLat(m, l), w);
                                            h.events.on({
                                                "click": markerInfo
                                            });
                                            centerMarkes.addMarker(h);
                                            showResult.push(D)
                                        }
                                        D.Id = 9;
                                        var z = D;
                                        yiyuanResult.push(z)
                                    } else {
                                        var p = Ext.getCmp("schoolCheckBox");
                                        if (p.getValue()) {
                                            var r = new SuperMap.Size(21, 25);
                                            var f = new SuperMap.Pixel( - (r.w / 2), -r.h);
                                            var w = new SuperMap.Icon("./images/school.png", r, f);
                                            var h = new SuperMap.Marker(new SuperMap.LonLat(m, l), w);
                                            h.events.on({
                                                "click": markerInfo
                                            });
                                            centerMarkes.addMarker(h);
                                            showResult.push(D)
                                        }
                                        D.Id = 10;
                                        xuexiaoResult.push(D)
                                    }
                                }
                            }
                    }
                }
            }
        }
    }
    quickSort(showResult, 0, showResult.length - 1);
    ShowSortResult()
}
function AnalysisprocessFailed(a) {
    $("#communicationReceiptPanel-innerCt").empty();
    $("#communicationReceiptPanel-innerCt").css('text-align', 'center');
    $("#communicationReceiptPanel-innerCt").append("缓冲区分析失败!" + '</br>' + a.error.errorMsg);
}
function MeasureDitance(c, e) {
    var d = new SuperMap.Geometry.Point(centerX, centerY);
    var b = new SuperMap.Geometry.Point(c, e);
    var a = d.distanceTo(b);
    a = a * 3600 * 33;
    a = parseInt(a);
    return a
}
function ClearAndFindPath(a, b) {
    findPath(a, b)
}
function ShowSortResult() {
    var b = showResult;
    if (b.length < 1 || !b) {
        var e = document.getElementById("queryResultsPanel-innerCt");
        if (e) {
            e.innerHTML = ""
        }
        return
    }
    var f = "<div class='locationDiv'>";
    var g = 1;
    f += ' <table  class="locationTable">';
    f += " <thead><tr>";
    f += "<th class='tableheader'>ID</th><th class='tableheader'>距离(m)</th><th class='tableheader'>地点名称</th></thead><tbody>";
    var a = b.length;
    for (var c = 0; c < a; c++) {
        f += "<tr onclick='bgChange(this)'";
        f += "name='";
        f += b[c].Place +"'";
        f += "><td>";
        f += "<div style='cursor:hand'";
        f += "onclick =\"" + "ClearAndFindPath(" + b[c].Point.x + "," + b[c].Point.y + "," +')">';
        f += g + "</div></td><td>";
        f += "<div style='cursor:hand'  onclick =\"" + "ClearAndFindPath(" + b[c].Point.x + "," + b[c].Point.y +')">';
        f += b[c].PointDistance + "</div></td><td>";
        f += "<div style='cursor:hand'  onclick =\"" + "ClearAndFindPath(" + b[c].Point.x + "," + b[c].Point.y +')">';
        f += b[c].Place + "</div></td><tr>";
        g++
    }
    f += "</tbody></table>";
    f += "</div>";
    var d = document;
    var e = d.getElementById("queryResultsPanel-innerCt");
    e.innerHTML = f
}
var analysisResultClick = false;
function markerInfo(x, y) {
    var lon = x;
    var lat = y;
    var place, location;
    var result = showResult;
    var len = result.length;
    if (analysisResultClick == true) {
        for (var i = 0; i < len; i++) {
            var geometry = result[i].Point;
            if (geometry.x == lon && geometry.y == lat) {
                location = new SuperMap.LonLat(lon, lat);
                place = result[i].Place;
                analysisResultClick = false;
                break;
            }
        }
    } else {
        location = this.getLonLat();
        for (var i = 0; i < len; i++) {
            var geometry = result[i].Point;
            if (geometry.x == location.lon && geometry.y == location.lat) {
                place = result[i].Place;
                $("tr[name=" + place + "]").trigger('click');
                break;
            }
        }
    }
    closeInfoWin();
    var contentHTML = "<div style='width:80px; font-size:12px;font-weight:bold ; opacity: 1.0'>"; 
    contentHTML += place;
    contentHTML += "</div>"; 
    var framedCloud = new SuperMap.Popup.FramedCloud(
        "chicken", 
        location,
        null,
        contentHTML,
        null,
        true,
        null,
        true
    );
    infowin = framedCloud;
    map.addPopup(framedCloud);
}
function skywebVideo() {
    /*拿到视频地址*/
    var src = randomSrc().src;
    closeInfoWin();
    popup = new SuperMap.Popup("chicken", mouselonlat, new SuperMap.Size(310, 210), src, true, null);
    popup.setBorder("solid 2px #c1c1c1");
    popup.panMapIfOutOfView = true;
    //popup.mixSize = 200;
    infowin = popup;
    map.addPopup(popup)
    /*var endTime = randomSrc().time;
    removeSecondChildren();
    initSubIframe("天网视频", src);*/
    //setTimeout("backMap()", endTime*1000);
    
}
function randomSrc() {
    var random = Math.round(Math.random()*1 + 1);
    var video = new Object();
    video.src = null;
    //video.time = null;
    switch (random) {
        case 1 :
        video.src = '<video autoplay="autoplay" src="./resource/skywebVideo/day.webm" width="100%" height="195" controls></video>';
        //video.time = 10;
        break;
        case 2 :
        video.src = '<video autoplay="autoplay" src="./resource/skywebVideo/night.webm" width="100%" height="195" controls></video>';
        //video.time = 13;
        break;
        default : 
        return null;
    }
    return video;
}
function Zhihui() {
    ClearAndAnalysis()
}
function Jingbao() {
    ClearAndAnalysis()
}
function TianWang() {
    ClearAndAnalysis();
}
function Renfang() {
    ClearAndAnalysis()
}
function Fanghu() {
    ClearAndAnalysis()
}
function Zhengfu() {
    ClearAndAnalysis()
}
function Gongan() {
    ClearAndAnalysis()
}
function Xuexiao() {
    ClearAndAnalysis()
}
function Yiyuan() {
    ClearAndAnalysis()
}
function findPath(g, f) {
    analysisResultClick = true;
    markerInfo(g, f);
    var b = new SuperMap.Geometry.Point(centerX, centerY);
    var h = new SuperMap.Geometry.Point(g, f);
    var c = new Array();
    c.push(b);
    c.push(h);
    var a, k, d, e;
    e = new SuperMap.REST.TransportationAnalystResultSetting({
        returnEdgeFeatures: true,
        returnEdgeGeometry: true,
        returnEdgeIDs: true,
        returnNodeFeatures: true,
        returnNodeGeometry: true,
        returnNodeIDs: true,
        returnPathGuides: true,
        returnRoutes: true
    });
    d = new SuperMap.REST.TransportationAnalystParameter({
        resultSetting: e
    });
    k = new SuperMap.REST.FindPathParameters({
        isAnalyzeById: false,
        nodes: c,
        hasLeastEdgeCount: false,
        parameter: d
    });
    a = new SuperMap.REST.FindPathService(neturl, {
        eventListeners: {
            "processCompleted": findPathCompleted,
            "processFailed": findPathError
        }
    });
    a.processAsync(k)
}
function findPathError(a) {
    $("#communicationReceiptPanel-innerCt").empty();
    $("#communicationReceiptPanel-innerCt").css('text-align', 'center');
    $("#communicationReceiptPanel-innerCt").append("缓冲区路径分析失败!")
}
function findPathCompleted(b) {
    var a = b.result;
    allPathScheme(a)
}
function allPathScheme(a) {
    if (i < a.pathList.length) {
        addPathDistence(a)
    } else {
        i = 0
    }
}
function addPathDistence(b) {
    if (j < b.pathList[i].route.points.length) {
        var e = new SuperMap.Feature.Vector();
        var d = [];
        for (var c = 0; c < 2; c++) {
            if (b.pathList[i].route.points[j + c]) {
                d.push(new SuperMap.Geometry.Point(b.pathList[i].route.points[j + c].x, b.pathList[i].route.points[j + c].y))
            }
        }
        var a = new SuperMap.Geometry.LinearRing(d);
        e.geometry = a;
        pathTime = setTimeout(function() {
            addPathDistence(b)
        },
        0.001);
        j++
    } else {
        clearTimeout(pathTime);
        j = 0;
        i++;
        allPathScheme(b)
    }
}
function markRoundGeometry(a) {
    var b = new SuperMap.Geometry.Point(centerX, centerY);
    var d = new SuperMap.Geometry.Polygon.createRegularPolygon(b, a, 100, 360);
    var c = new SuperMap.Feature.Vector();
    c.geometry = d;
    c.style = yuanstyle;
    yuanvectorLayer.addFeatures(c)
}
function quickSort(a, b, f) {
    if (b >= f) {
        return
    }
    var d = b;
    var c = f;
    var g = (a[b].PointDistance + a[b + 1].PointDistance) / 2;
    var e = d,
    h = c;
    while (1) {
        if (d == c) {
            break
        }
        for (;; --c) {
            if (a[c].PointDistance < g) {
                e = c;
                break
            }
            if (d == c) {
                break
            }
        }
        for (;; d++) {
            if (a[d].PointDistance >= g) {
                h = d;
                var k = a[e];
                a[e] = a[h];
                a[h] = k;
                break
            }
            if (d == c) {
                break
            }
        }
    }
    showResult = a;
    quickSort(showResult, b, d);
    quickSort(showResult, d + 1, f)
}
var markerclick = false;
var infowin = null;
var markerIcon, markerIconLayer, mouselonlat, markerlon, markerlat, markerurl, markerAlt, markerundeployment;
function openwindow(b, a, c, f) {
    var b;
    var a;
    var c;
    var f;
    var e = (window.screen.availHeight - 30 - f) / 2;
    var d = (window.screen.availWidth - 10 - c) / 2;
    window.open(b, a, "height=" + f + ",,innerHeight=" + f + ",width=" + c + ",innerWidth=" + c + ",top=" + e + ",left=" + d + ",toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no")
}
function sendbdbw() {
    var a = new Date();
    var b = "收到报文-" + a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds() + "<br>";
    $("#bigDipperMsgPanel-innerCt").append(b)
}
function prepareDeployment(a) {
    if (markerclick && markerurl && !markerundeployment) {
        deploymentMarker()
    }
    markerundeployment = false
}
function setMousePosition(a) {
    mouselonlat = map.getLonLatFromPixel(new SuperMap.Pixel(a.xy.x, a.xy.y));
    markerlon = mouselonlat.lon.toFixed(6);
    markerlat = mouselonlat.lat.toFixed(6)
}
var markerInfoArray = new Object();
var markerPath = new Object();
//var markerPathArray = [];
function markerClick(c) {
    if (markerclick == true) {
        markerclick = false;
        c.classList.remove("markerclicked");
        if (removeAnimatorLayer) {
            $("#communicationReceiptPanel-innerCt").empty();
            pathLayer.removeAllFeatures();
            map.removeLayer(animatorLayer);
            removeAnimatorLayer = false
        }
        if (complate = true) {
            complate = false;
            oldMarker = null;
        }
        return
    }
    markerclick = true;
    var a = document.querySelectorAll(".markerclicked");
    for (var b = 0; b < a.length; b++) {
        a[b].classList.remove("markerclicked")
    }
    c.classList.add("markerclicked");
    markerurl = c.getAttribute("src");
    markerAlt = c.getAttribute("alt");
    //markerPath.url = markerurl;
    //markerPathArray.push(markerPath);
}
function deploymentMarker() {
    var lon = markerlon;
    var lat = markerlat;
    if (markerclick == false) {
        return
    }
    if (comboHanlderValue == "灾害类型") {
        var a = new SuperMap.Size(32, 32);
        var c = new SuperMap.Pixel( - (a.w / 2), -a.h);
        var b = new SuperMap.Icon(markerurl, a, c);
        markerIcon = new SuperMap.Marker(new SuperMap.LonLat(lon, lat), b);
    } else {
        var a_1 = new SuperMap.Size(45, 18);
        var c_1 = new SuperMap.Pixel( - (a_1.w / 2), -a_1.h);
        var b_1 = new SuperMap.Icon(markerurl, a_1, c_1);
        markerIcon = new SuperMap.Marker(new SuperMap.LonLat(lon, lat), b_1);
    }
    markerIcon.src = markerurl;
    markerIcon.alt = markerAlt;
    markerIconLayer.addMarker(markerIcon);
    markerIcon.events.on({
        "click": markerOption
    });
}
var oldPoint;
function markerOption() {
    currentPoint = new SuperMap.Geometry.Point(markerlon, markerlat);
    oldPoint = currentPoint;
    markerundeployment = true;
    markerIcon = this;
    var alt = markerIcon.alt;
    var d = '<input type="button" id="pathDemonstration"';
    d += 'value="路径演示" onClick="pathDemonstration(this)"></input>';
    d += '<input type="button" id="stratPathDemonstration"';
    d += 'value="取消部署" onClick="undeployment()"></input>';
    d += '<input type="button" id="undeploymentAll"';
    d += 'value="清空标绘" onClick="undeploymentAll()"></input>';
    var b = '<input type="button" id="stratPathDemonstration"';
    b += 'value="取消部署" onClick="undeployment()"></input>';
    b += '<input type="button" id="undeploymentAll"';
    b += 'value="清空标绘" onClick="undeploymentAll()"></input>';
    var c = new SuperMap.Popup.FramedCloud(
        "chicken", 
        mouselonlat,
        new SuperMap.Size(245, 45),
        d,
        null,
        true,
        null,
        true
    );
    c.autoSize = false;
    var a = new SuperMap.Popup.FramedCloud(
        "chicken", 
        mouselonlat,
        new SuperMap.Size(170, 45),
        b,
        null,
        true,
        null,
        true
    );
    a.autoSize = false;
    /*var c = new SuperMap.Popup("chicken", mouselonlat, new SuperMap.Size(260, 35), d, true, null);
    var a = new SuperMap.Popup("chicken", mouselonlat, new SuperMap.Size(200, 35), b, true, null);*/
    c.setBorder("solid 1px #5fa2dd");
    c.panMapIfOutOfView = true;
    //c.mixSize = 200;
    a.setBorder("solid 1px #5fa2dd");
    a.panMapIfOutOfView = true;
    //a.mixSize = 200;
    if (alt === "surviliance" || alt === "firealarm" || alt === "police" || alt === "trnsp_ent") {
        closeInfoWin();
        infowin = c;
        map.addPopup(c)
    } else {
        closeInfoWin();
        infowin = a;
        map.addPopup(a)
    }
}
function undeployment() {
    markerIconLayer.removeMarker(markerIcon);
    closeInfoWin();
    markerundeployment = true
}
function undeploymentAll() {
    markerIconLayer.clearMarkers();
    closeInfoWin();
    if (removeAnimatorLayer) {
        $("#communicationReceiptPanel-innerCt").empty();
        pathLayer.removeAllFeatures();
        map.removeLayer(animatorLayer);
        removeAnimatorLayer = false
    }
    markerundeployment = true;
    complate = false;
    oldMarker = null;
}
var removeAnimatorLayer = false;
function pathDemonstration() {
    markerIconLayer.removeMarker(markerIcon);
    if (complate == true) {
        markerIconLayer.addMarker(oldMarker);
        complate = false;
    }
    var src = markerIcon.src;
    setCarStyle(src);
    $("#communicationReceiptPanel-innerCt").empty();
    $("#communicationReceiptPanel-innerCt").css('text-align', 'center');
    if (removeAnimatorLayer) {
        map.removeLayer(animatorLayer);
        removeAnimatorLayer = false;
    }
    animatorLayer = new SuperMap.Layer.AnimatorVector("Cars", {displayInLayerSwitcher:false},
    {
        speed: 0.01,
        startTime: 0,
        endtime: 100
    });
    closeInfoWin();
    infowin = this;
    pathNodeArray[0] = currentPoint;
    targetPoint = new SuperMap.Geometry.Point(centerX, centerY);
    pathNodeArray[1] = targetPoint;
    var b = targetPoint.x && targetPoint.y && currentPoint.x && currentPoint.y;
    if (!b) {
        Ext.MessageBox.alert("系统提示", "路径演示起始点有误 ! ");
        closeInfoWin();
        return
    }
    queryLineBySQL();
    markerundeployment = true;
    map.addLayer(animatorLayer);
    animatorLayer.animator.start();
    animatorLayer.events.on({"drawfeaturestart": drawFeatureStart});
    animatorLayer.animator.setRepeat(false);
    removeAnimatorLayer = true;
    $("#communicationReceiptPanel-innerCt").append("路径演示" + "<br>");
}
var complate = false;
var oldMarker;
function drawFeatureStart(f) {
    var g = f.geometry;
    /*演示完成，车辆抵达事发点*/
    if (g.x == centerX && g.y == centerY) {
        complate = true;
        animatorLayer.animator.stop();
        var src = markerIcon.src;
        var alt = markerIcon.alt;
        if (alt === "surviliance" || alt === "firealarm" || alt === "police" || alt === "trnsp_ent") {
            var a = new SuperMap.Size(45, 18);
            var c = new SuperMap.Pixel( - (a.w / 2), -a.h);
            var b = new SuperMap.Icon(src, a, c);
            oldMarker = new SuperMap.Marker(new SuperMap.LonLat(currentPoint.x, currentPoint.y), b);
            oldMarker.src = src;
            oldMarker.alt = alt;
            /*markerIconLayer.addMarker(markerIcon);*/
            oldMarker.events.on({
                "click": markerOption
            });
        }
    }
}
function queryLineBySQL() {
    var a, d, b, c;
    c = new SuperMap.REST.TransportationAnalystResultSetting({
        returnEdgeFeatures: true,
        returnEdgeGeometry: true,
        returnEdgeIDs: true,
        returnNodeFeatures: true,
        returnNodeGeometry: true,
        returnNodeIDs: true,
        returnPathGuides: true,
        returnRoutes: true
    });
    b = new SuperMap.REST.TransportationAnalystParameter({
        resultSetting: c
    });
    d = new SuperMap.REST.FindPathParameters({
        isAnalyzeById: false,
        nodes: pathNodeArray,
        hasLeastEdgeCount: false,
        parameter: b
    });
    a = new SuperMap.REST.FindPathService(neturl, {
        eventListeners: {
            "processCompleted": pathDemonstrationCompleted,
            "processFailed": pathDemonstrationFailed
        }
    });
    a.processAsync(d)
}
function pathDemonstrationCompleted(g) {
    var d = 0;
    var p = g.result;
    var o = p.pathList.length;
    var f = [];
    for (var b = 0; b < o; b++) {
        var n = p.pathList[0].pathGuideItems,
        e = n.length;
        //$("#communicationReceiptPanel-innerCt").append("carNum:" + e + "<br>");
        for (var a = 0; a < e; a++) {
            var c = new SuperMap.Feature.Vector();
            c.geometry = n[a].geometry;
            c.attributes = {
                description: n[a].description
            };
            if (c.geometry.CLASS_NAME === "SuperMap.Geometry.Point") {
                var l = c.geometry;
                var h = new SuperMap.Feature.Vector(l, {
                    FEATURDID: "point",
                    TIME: d
                },
                styleCar);
                d++;
                f.push(h)
            }
        }
    }
    animatorLayer.addFeatures(f);
    allScheme(p)
}
var pathTime, pathListIndex = 0,
routeCompsIndex = 0;
function allScheme(a) {
    if (pathListIndex < a.pathList.length) {
        addPath(a)
    } else {
        pathListIndex = 0;
        addPathGuideItems(a)
    }
}
function addPath(c) {
    if (routeCompsIndex < c.pathList[pathListIndex].route.components.length) {
        var f = new SuperMap.Feature.Vector();
        var e = [];
        for (var d = 0; d < 2; d++) {
            if (c.pathList[pathListIndex].route.components[routeCompsIndex + d]) {
                var g = c.pathList[pathListIndex].route.components;
                var b = new SuperMap.Geometry.Point(g[routeCompsIndex + d].x, g[routeCompsIndex + d].y);
                e.push(b)
            }
        }
        var a = new SuperMap.Geometry.LinearRing(e);
        f.geometry = a;
        f.style = styleLine;
        pathLayer.addFeatures(f);
        pathTime = setTimeout(function() {
            addPath(c)
        },
        0.001);
        routeCompsIndex++
    } else {
        clearTimeout(pathTime);
        routeCompsIndex = 0;
        pathListIndex++;
        allScheme(c)
    }
}
function addPathGuideItems(c) {
    pathLayer.removeAllFeatures();
    for (var e = 0; e < c.pathList.length; e++) {
        var f = c.pathList[pathListIndex].pathGuideItems,
        b = f.length;
        for (var a = 0; a < b; a++) {
            var d = new SuperMap.Feature.Vector();
            d.geometry = f[a].geometry;
            d.attributes = {
                description: f[a].description
            };
            if (d.geometry.CLASS_NAME === "SuperMap.Geometry.Point") {
                d.style = styleLine
            } else {
                d.style = styleLine
            }
            pathLayer.addFeatures(d)
        }
    }
}
function pathDemonstrationFailed(a) {
    $("#communicationReceiptPanel-innerCt").empty();
    $("#communicationReceiptPanel-innerCt").css('text-align', 'center');
    $("#communicationReceiptPanel-innerCt").append("查询失败" + "<br>");
    $("#communicationReceiptPanel-innerCt").append(a.error.errorMsg + "<br>")
}
function setCarStyle(src) {
    var markerurl = src;
    switch (src) {
    case "images/police.png":
        styleCar = styleCar2;
        break;
    case "images/firealarm.png":
        styleCar = styleCar3;
        break;
    case "images/trnsp_ent.png":
        styleCar = styleCar1;
        break;
    case "images/surviliance.png":
        styleCar = styleCar4;
        break;
    default:
        styleCar = null;
    }
}
function videoPopup() {
    var a = '<video src="./resource/videos/demo.mp4" width="300" height="200" controls></video>';
    closeInfoWin();
    popup = new SuperMap.Popup("chicken", mouselonlat, new SuperMap.Size(310, 210), a, true, null);
    popup.setBorder("solid 2px #c1c1c1");
    popup.panMapIfOutOfView = true;
    popup.mixSize = 200;
    infowin = popup;
    map.addPopup(popup)
}
function closeInfoWin() {
    if (infowin) {
        try {
            infowin.hide();
            infowin.destroy()
        } catch(a) {}
    }
}
function initIconDeploymentArea1() {
    var a = '<div id = "icon_array_1">';
    a += '<img src="images/surviliance.png" alt="surviliance" onclick="markerClick(this)"/>';
    a += '<img src="images/firealarm.png" alt="firealarm" onclick="markerClick(this)"/>';
    a += '<img src="images/police.png" alt="police"    onclick="markerClick(this)"/>';
    a += '<img src="images/trnsp_ent.png" alt="trnsp_ent" onclick="markerClick(this)"/>';
    a += '<img src="images/resc_tm.png" alt="resc_tm"  onclick="markerClick(this)"/>';
    a += '<img src="images/command.png" alt="command"  onclick="markerClick(this)"/>';
    $("#iconDeployment-innerCt").append(a)
}
function initIconDeploymentArea2() {
    var a = '<div id = "icon_array_2">';
    a += '<img src="images/drought.png" alt="drought" onclick="markerClick(this)"/>';
    a += '<img src="images/earth_qk.png" alt="earth_qk" onclick="markerClick(this)"/>';
    a += '<img src="images/fire.png" alt="fire" onclick="markerClick(this)"/>';
    a += '<img src="images/flood.png" alt="flood"  onclick="markerClick(this)"/>';
    a += '<img src="images/geol_dis.png" alt="grol_dis"    onclick="markerClick(this)"/>';
    a += '<img src="images/met_dis.png" alt="met_dis" onclick="markerClick(this)"/>';
    $("#iconDeployment-innerCt").append(a)
}
function msgBtnClickHanlder(a, b) {
    switch (a.text) {
    case "查找":
        ClearHighlightAndQuery();
        break;
    case "分析":
        ClearAndAnalysis();
        break;
    case "呼叫":
        callCivAirDefense();
        break;
    case "热力图":
        thermodynamicChart();
        break;
    case "返回地图":
        backMap();
        break;
    case "民航信息":
        civilAviationInfo();
        break;
    case "天气":
        weatherWin();
        break;
    case "气象":
        meteorologicalWin();
        break;
    case "地震":
        earthquakeWin();
        break;
    case "新闻":
        dailyNews();
        break;
    case "四川日报":
        sichuanDaily();
        break;
    case "成都日报":
        renmingDaily();
        break;
    case "水文":
        waterConservancy();
        break;
    default:
        return
    }
}
function callCivAirDefense() {
    removeSecondChildren();
    initSubIframe("成都人防办", "./pages/Civil Air Defense.html")
}
function civilAviationInfo() {
    removeSecondChildren();
    initSubIframe("民航信息", "http://zh.flightaware.com/live/map")
}
function weatherWin() {
    removeSecondChildren();
    initSubIframe("天气", "https://earth.nullschool.net/#current/wind/surface/level/overlay=temp/orthographic=-262.65,31.21,1466")
}
function meteorologicalWin() {
    removeSecondChildren();
    var a = "https://earth.nullschool.net/#current/chem/surface/level/overlay=cosc/orthographic=-262.65,31.21,1466/loc=103.542,28.477";
    initSubIframe("气象", a)
}
function earthquakeWin() {
    removeSecondChildren();
    initSubIframe("地震", "http://www.ceic.ac.cn/onmap/id:1")
}
function sichuanDaily() {
    removeSecondChildren();
    initSubIframe("四川日报", "http://epaper.scdaily.cn")
}
function waterConservancy() {
    removeSecondChildren();
    initSubIframe("水文测报", "http://www.schwr.com/swcb/");
}
function renmingDaily() {
    window.alert = function() {
        return false
    };
    removeSecondChildren();
    initSubIframe("成都日报", "http://www.cdrb.com.cn")
}
function dailyNews() {
    removeSecondChildren();
    initSubIframe("新闻", "http://www.newssc.org/map.html")
}
function backMap() {
    var a = $("#mapPanel-innerCt");
    var b = Ext.getCmp("mapPanel");
    b.setTitle("可视化应急指挥平台");
    a.children().eq(0).show();
    showNav();
    heatMapLayer.removeAllFeatures()
}
function thermodynamicChart() {
    backMap();
    heatMapLayer.removeAllFeatures();
    var d = [];
    var h = [new SuperMap.Geometry.Point(104.077857, 30.657068), new SuperMap.Geometry.Point(104.077732, 30.655043), new SuperMap.Geometry.Point(104.079865, 30.662601), new SuperMap.Geometry.Point(104.077895, 30.657125), new SuperMap.Geometry.Point(104.076156, 30.654252), new SuperMap.Geometry.Point(104.077807, 30.656354), new SuperMap.Geometry.Point(104.078355, 30.657302), new SuperMap.Geometry.Point(104.078159, 30.657006), new SuperMap.Geometry.Point(104.075812, 30.655138), new SuperMap.Geometry.Point(104.076799, 30.655214), new SuperMap.Geometry.Point(104.076911, 30.655442), new SuperMap.Geometry.Point(104.078853, 30.655171), new SuperMap.Geometry.Point(104.074669, 30.653991)];
    var b = [new SuperMap.Geometry.Point(104.065967, 30.658051), new SuperMap.Geometry.Point(104.064494, 30.657438), new SuperMap.Geometry.Point(104.065812, 30.657868), new SuperMap.Geometry.Point(104.065853, 30.657105), new SuperMap.Geometry.Point(104.066658, 30.656925), new SuperMap.Geometry.Point(104.065544, 30.655812), new SuperMap.Geometry.Point(104.066277, 30.655905), new SuperMap.Geometry.Point(104.063142, 30.657658), new SuperMap.Geometry.Point(104.065967, 30.658051), new SuperMap.Geometry.Point(104.059585, 30.657893), new SuperMap.Geometry.Point(104.065967, 30.658051), new SuperMap.Geometry.Point(104.066463, 30.655023), new SuperMap.Geometry.Point(104.067657, 30.658657), new SuperMap.Geometry.Point(104.065211, 30.659731), new SuperMap.Geometry.Point(104.06592, 30.661011), new SuperMap.Geometry.Point(104.06578, 30.661921), new SuperMap.Geometry.Point(104.067061, 30.659821), new SuperMap.Geometry.Point(104.069175, 30.658716)];
    var f = [new SuperMap.Geometry.Point(104.06518, 30.57808), new SuperMap.Geometry.Point(104.06594, 30.57656), new SuperMap.Geometry.Point(104.06622, 30.57874), new SuperMap.Geometry.Point(104.06409, 30.57504), new SuperMap.Geometry.Point(104.06556, 30.57627), new SuperMap.Geometry.Point(104.06342, 30.57708), new SuperMap.Geometry.Point(104.06328, 30.57798), new SuperMap.Geometry.Point(104.06703, 30.57779), new SuperMap.Geometry.Point(104.06504, 30.57451), new SuperMap.Geometry.Point(104.0676, 30.57537), new SuperMap.Geometry.Point(104.06808, 30.57637)];
    var g = [new SuperMap.Geometry.Point(104.05987, 30.66395), new SuperMap.Geometry.Point(104.06004, 30.66435), new SuperMap.Geometry.Point(104.05819, 30.66463), new SuperMap.Geometry.Point(104.05898, 30.66424), new SuperMap.Geometry.Point(104.05614, 30.66502), new SuperMap.Geometry.Point(104.05696, 30.66477), new SuperMap.Geometry.Point(104.05796, 30.66446), new SuperMap.Geometry.Point(104.05827, 30.66419)];
    for (var e = 0,
    a = h.length; e < a; e++) {
        var c = new SuperMap.Feature.Vector(h[e], {
            "height": Math.random() * 9,
            "radius": Math.random() * 50 - 30
        });
        d.push(c)
    }
    for (var e = 0,
    a = b.length; e < a; e++) {
        var c = new SuperMap.Feature.Vector(b[e], {
            "height": Math.random() * 9,
            "radius": Math.random() * 50 - 30
        });
        d.push(c)
    }
    for (var e = 0,
    a = f.length; e < a; e++) {
        var c = new SuperMap.Feature.Vector(f[e], {
            "height": Math.random() * 9,
            "radius": Math.random() * 50 - 30
        });
        d.push(c)
    }
    for (var e = 0,
    a = g.length; e < a; e++) {
        var c = new SuperMap.Feature.Vector(g[e], {
            "height": Math.random() * 9,
            "radius": Math.random() * 50 - 30
        });
        d.push(c)
    }
    heatMapLayer.addFeatures(d);
    map.addLayer(heatMapLayer)
}
function initSubIframe(f, e) {
    hideNav();
    var c = f;
    var d = $("#mapPanel-innerCt");
    var b = $("#SuperMap.Map_17_SuperMap_Viewport");
    var g = Ext.getCmp("mapPanel");
    d.children().eq(0).hide();
    var a = "<iframe frameborder='0' height='100%' width='100%'";
    a += 'src="';
    a += e + '"';
    a += "></iframe>";
    d.append(a);
    g.setTitle(c)
}
function removeSecondChildren() {
    var b = $("#mapPanel-innerCt");
    var a = b.children().eq(1);
    if (a.length > 0) {
        a.remove()
    }
}
var originResult, lineLayer, polygonLayer, drawControls, prjCoordSys, scaleCenter, href;
function initNavigationControl() {
    var b = '<a id="viewEntire" onclick="viewEntire()" title="全幅显示"></a>';
    b += '<a id="line" onclick="distanceMeasure()" title="距离量算"></a>';
    b += '<a id="polygon" onclick="areaMeasure()" title="面积量算"></a>';
    b += '<a id="clean" onclick="navRemoveAllFeatures()" title="清除"></a>';
    var a = $("#mapPanel-body");
    a.append(b)
}
function hideNav() {
    $("#viewEntire").hide();
    $("#line").hide();
    $("#polygon").hide();
    $("#clean").hide()
}
function showNav() {
    $("#viewEntire").show();
    $("#line").show();
    $("#polygon").show();
    $("#clean").show()
}
function viewEntire() {
    var b = map.getNumZoomLevels();
    if (!b) {
        return
    }
    for (var a = 0; a < b; a++) {
        map.zoomOut()
    }
}
function distanceMeasure() {
    lineLayer.removeAllFeatures();
    drawLine.activate()
}
function areaMeasure() {
    polygonLayer.removeAllFeatures();
    drawPolygon.activate()
}
function drawLineCompleted(b) {
    drawLine.deactivate();
    var d = b.feature.geometry,
    a = new SuperMap.REST.MeasureParameters(d),
    c = new SuperMap.REST.MeasureService(url);
    c.events.on({
        "processCompleted": distanceMeasureCompleted
    });
    c.measureMode = SuperMap.REST.MeasureMode.DISTANCE;
    c.processAsync(a)
}
function drawPolygonCompleted(b) {
    drawPolygon.deactivate();
    var d = b.feature.geometry,
    a = new SuperMap.REST.MeasureParameters(d),
    c = new SuperMap.REST.MeasureService(url);
    c.events.on({
        "processCompleted": areaMeasureCompleted
    });
    c.measureMode = SuperMap.REST.MeasureMode.AREA;
    c.processAsync(a)
}
function distanceMeasureCompleted(b) {
    $("#communicationReceiptPanel-innerCt").empty();
    $("#communicationReceiptPanel-innerCt").css('text-align', 'center');
    $("#communicationReceiptPanel-innerCt").append("量算结果: ");
    var d = b.result.distance.toFixed(2);
    var a = (d / 1000).toFixed(2);
    var c = b.result.unit;
    if (c == "METER") {
        if (a < 1) {
            $("#communicationReceiptPanel-innerCt").append(d + " 米")
        } else {
            $("#communicationReceiptPanel-innerCt").append(a + " 千米")
        }
    } else {
        $("#communicationReceiptPanel-innerCt").append("</br>" + "Unit Error!" + "</br>" + "Current unit: " + c)
    }
}
function areaMeasureCompleted(b) {
    $("#communicationReceiptPanel-innerCt").empty();
    $("#communicationReceiptPanel-innerCt").css('text-align', 'center');
    $("#communicationReceiptPanel-innerCt").append("量算结果: " + "</br>");
    var d = b.result.area.toFixed(2);
    var c = b.result.unit;
    var a = (d / 100000).toFixed(2);
    if (c == "METER") {
        if (a < 1) {
            $("#communicationReceiptPanel-innerCt").append(d + " 平方米")
        } else {
            $("#communicationReceiptPanel-innerCt").append(a + " 平方千米")
        }
    } else {
        $("#communicationReceiptPanel-innerCt").append("</br>" + "Unit Error!" + "</br>" + "Current unit: " + c)
    }
}
function navRemoveAllFeatures() {
    $("#communicationReceiptPanel-innerCt").empty();
    lineLayer.removeAllFeatures();
    polygonLayer.removeAllFeatures()
}
function sendBigDipperMsg() {
    var bigDipperText = $('#bigDipperMsgTextArea-inputEl').val();
    var ranks = $('#bigDipperMsgCombo-inputEl').val();
    $("#communicationReceiptPanel-innerCt").empty();
    //$("#communicationReceiptPanel-innerCt").css('text-align', 'left');
    $("#communicationReceiptPanel-innerCt").append('发送对象：' + ranks + '</br>');
    $("#communicationReceiptPanel-innerCt").append('报文回执：' + "发送成功 !");
    //$("#communicationReceiptPanel-innerCt").append(bigDipperText);
}
function clearBigDipperMsg() {
    $('#bigDipperMsgTextArea-inputEl').val('');
}
function pageLayout() {
    var g = [{
        xtype: "button",
        text: "返回地图",
        id: "airCombat",
        cls: "warningMsgBtn-complex-air",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "民航信息",
        id: "civilAviationInfo",
        cls: "warningMsgBtn-complex-civ",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "天气",
        id: "weather",
        cls: "warningMsgBtn",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "水文",
        id: "waterConservancy",
        cls: "warningMsgBtn",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "地震",
        id: "earthquake",
        cls: "warningMsgBtn",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "热力图",
        id: "environmentalMonitoring",
        cls: "warningMsgBtn_TC",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "气象",
        id: "meteorological",
        cls: "warningMsgBtn_MP",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "新闻",
        id: "news",
        cls: "warningMsgBtn_NEWS",
        handler: msgBtnClickHanlder
    }];
    var o = [{
        xtype: "button",
        text: "总&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部",
        id: "provincialMilitaryCommand",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "总&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;队",
        id: "provincialGovernment",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;队",
        id: "provincialPartyCommittee",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "中&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;队",
        id: "nationalAirDefense",
        handler: msgBtnClickHanlder
    }];
    var b = [{
        xtype: "button",
        text: "四川日报",
        id: "sichuanDaily",
        cls: "mediaVideoBtn-scDaily",
        handler: msgBtnClickHanlder
    },
    {
        xtype: "button",
        text: "成都日报",
        id: "chengduDaily",
        cls: "mediaVideoBtn-cdDaily",
        handler: msgBtnClickHanlder
    },
    ];
    var m = [{
        xtype: "combo",
        width: 250,
        store: ["成都", "自贡", "攀枝花", "德阳", "泸州", "绵阳", "广元", "遂宁", "内江", "南充", "眉山", "乐山", "宜宾", "广安", "达州", "雅安", "巴中", "资阳", "阿坝", "甘孜", "凉山"],
        value: "成都",
        id: "locationCombo",
        cls: "locationCombo"
    },
    {
        xtype: "textfield",
        id: "locationText",
        emptyText: '输入查询地点',
        width: 150
    },
    {
        xtype: "button",
        text: "查找",
        width: 85,
        id: "locationQueryBtn",
        cls: "locationQueryBtn",
        handler: msgBtnClickHanlder
    }];
    var c = [{
        xtype: "combo",
        width: 250,
        store: ["米", "公里"],
        value: "公里",
        id: "bufferAnalysisCombo",
        cls: "bufferAnalysisCombo"
    },
    {
        xtype: "textfield",
        id: "bufferAnalysisText",
        emptyText: '输入缓冲区分析半径',
        width: 150
    },
    {
        xtype: "button",
        text: "分析",
        width: 85,
        id: "bufferAnalysisBtn",
        cls: "bufferAnalysisBtn",
        handler: msgBtnClickHanlder
    }];
    var k = [{
        xtype: "checkboxgroup",
        id: "rescueRelatedCheckBox",
        layout: "fit",
        items: [{
            boxLabel: "政府部门",
            id: "governmentSectorCheckBox",
            inputValue: "政府部门",
            listeners: {
                change: Zhengfu
            }
        },
        {
            boxLabel: "司法部门",
            id: "policeFireCheckBox",
            inputValue: "司法部门",
            listeners: {
                change: Gongan
            }
        },
        {
            boxLabel: "医院",
            id: "hospitalCheckBox",
            inputValue: "医院",
            listeners: {
                change: Yiyuan
            }
        },
        {
            boxLabel: "学校",
            id: "schoolCheckBox",
            inputValue: "学校",
            listeners: {
                change: Xuexiao
            }
        }]
    }];
    var a = [{
        xtype: "checkboxgroup",
        layout: "fit",
        items: [{
            boxLabel: "固定执勤点",
            id: "commandPostCheckBox",
            inputValue: "固定执勤点",
            listeners: {
                change: gdzqdHandler
            }
        },
        {
            boxLabel: "执勤范围查询",
            id: "alarmCheckBox",
            inputValue: "执勤范围查询",
            listeners: {
                change: zqfwHandler
            }
        },
        {
            boxLabel: "视频查勤",
            id: "jiankongCheckBox",
            inputValue: "视频查勤",
            listeners: {
                change: jkspHandler
            }
        }]
    }];
    var d = [{
        xtype: "checkboxgroup",
        layout: "fit",
        items: [{
            boxLabel: "天网",
            id: "skynetCheckBox",
            inputValue: "天网",
            listeners: {
                change: TianWang
            }
        },
        {
            boxLabel: "无线图传",
            id: "wirelessImageCheckBox",
            inputValue: "无线图传",
            listeners: {
                change: ClearAndAnalysis
            }
        }]
    }];
    var h = [{
        xtype: "checkboxgroup",
        layout: "fit",
        items: [{
            boxLabel: "药品",
            id: "drugsCheckBox",
            inputValue: "药品",
            listeners: {
                change: ClearAndAnalysis
            }
        },
        {
            boxLabel: "食品工具",
            id: "foodToolsCheckBox",
            inputValue: "食品工具",
            listeners: {
                change: ClearAndAnalysis
            }
        },
        {
            boxLabel: "交通工具",
            id: "vehicleCheckBox",
            inputValue: "交通工具",
            listeners: {
                change: ClearAndAnalysis
            }
        },
        {
            boxLabel: "救援器材",
            id: "rescueEquipmentCheckBox",
            inputValue: "救援器材",
            listeners: {
                change: ClearAndAnalysis
            }
        }]
    }];
    var f = [
        {
            xtype: "textarea",
            fieldLabel: '北斗报文',
            labelWidth: 62,
            id: "bigDipperMsgTextArea",
            cls: "bigDipperMsgTextArea",
            width: 240,
            height: 120
        },
        {
            xtype: "combo",
            width: 240,
            fieldLabel: '发送对象',
            labelWidth: 58,
            store: ["一中队", "二中队", "三中队"],
            value: "一中队",
            id: "bigDipperMsgCombo",
            cls: "bigDipperMsgCombo"
        },
        {
            xtype: "button",
            text: "发送",
            width: 85,
            id: "bigDipperBtnSend",
            handler: sendBigDipperMsg
        },
        {
            xtype: "button",
            text: "清空",
            width: 85,
            id: "bigDipperBtnClear",
            handler: clearBigDipperMsg
        }
    ];
    var e = {
        xtype: "container",
        region: "center",
        layout: "fit",
        id: "centerRegion",
        items: {
            title: "可视化勤务管理与作战指挥平台",
            titleAlign: "center",
            id: "mapPanel",
            region: "center",
        }
    },
    p = {
        title: "地图服务",
        titleAlign: "center",
        id: "mapOperationPanle",
        region: "west",
        weight: 10,
        layout: "vbox",
        defaults: {
            width: 250,
            frame: true
        },
        collapsible: true,
        items: [{
            frame: false,
            width: 250,
            height: mapServicePanelHeight,
            layout: "accordion",
            items: [{
                xtype: "panel",
                title: "多元信息",
                id: "warningMsg",
                titleAlign: "center",
                items: g
            },
            {
                xtype: "panel",
                title: "视频会议",
                id: "videoConferencing",
                titleAlign: "center",
                items: o
            },
            {
                xtype: "panel",
                title: "媒体视频",
                id: "mediaVideo",
                titleAlign: "center",
                items: b
            }]
        },
        {
            frame: false,
            width: 250,
            height: 500,
            id: "iconDeploymentVBOx",
            layout: "vbox",
            items: [{
                title: "态势标图",
                id: "posturePlotting",
                titleAlign: "center",
                width: 250,
                height: 80,
                frame: true,
                items: {
                    xtype: "combo",
                    width: 250,
                    id: "posturePlottingCombo",
                    cls: "posturePlottingCombo",
                    store: ["灾害类型", "力量部署"],
                    value: "力量部署",
                    listeners: {
                        scope: this,
                        "select": comboHanlder
                    }
                }
            },
            {
                title: "图标部署",
                id: "iconDeployment",
                titleAlign: "center",
                width: 250,
                height: 178,
                frame: true,
                items: []
            }]
        }]
    },
    q = {
        id: "notificationAreaPanel",
        region: "south",
        weight: -1,
        height: 150,
        spilt: true,
        frame: false,
        layout: {
            type: "column",
            frame: true
        },
        items: [{
            title: "北斗报文",
            titleAlign: "center",
            id: "bigDipperMsgPanel",
            columnWidth: 0.2,
            bodyStyle: "overflow-x:hidden;overflow-y:auto;",
            height: 148,
            frame: true,
            border: true
        },
        {
            title: "查询结果",
            titleAlign: "center",
            id: "queryResultsPanel",
            columnWidth: 0.6,
            bodyStyle: "overflow-x:hidden;overflow-y:auto;",
            height: 148,
            frame: true,
            border: true
        },
        {
            title: "通信回执",
            titleAlign: "center",
            id: "communicationReceiptPanel",
            columnWidth: 0.2,
            bodyStyle: "overflow-x:hidden;overflow-y:auto;",
            height: 148,
            frame: true,
            border: true
        }]
    },
    n = {
        title: "功能面板",
        titleAlign: "center",
        id: "muitiplePanel",
        region: "east",
        weight: 10,
        width: 260,
        collapsible: true,
        layout: {
            type: "accordion",
            animate: true
        },
        items: [{
            title: "地图定位",
            id: "mapLocation",
            titleAlign: "center",
            width: 250,
            height: 125,
            collapsible: true,
            items: m
        },
        {
            title: "缓冲区分析",
            id: "bufferAnalysis",
            titleAlign: "center",
            width: 250,
            height: 125,
            collapsible: true,
            collapsed: true,
            items: c
        },
        {
            xtype: "panel",
            title: "特殊目标",
            id: "rescueRelated",
            titleAlign: "center",
            items: k
        },
        {
            xtype: "panel",
            title: "勤务管控",
            id: "airDefenseForce",
            titleAlign: "center",
            items: a
        },
        {
            xtype: "panel",
            title: "现场视频",
            id: "liveVideo",
            titleAlign: "center",
            items: d
        },
        {
            xtype: "panel",
            title: "物资储蓄",
            id: "materialSaving",
            titleAlign: "center",
            items: h
        },
        {
            xtype: "panel",
            title: "北斗报文",
            id: "bigDipperMsg",
            titleAlign: "center",
            items: f
        }]
    };
    Ext.create("Ext.Viewport", {
        layout: "border",
        defaults: {
            frame: true,
            split: true
        },
        items: [p,e,q,n ]
    });
    var l = $("#mapPanel-innerCt");
    var e = Ext.getCmp("mapPanel");
    Ext.getCmp("mapLocation").on("expand",
    function() {
        e.setTitle("可视化勤务管理与作战指挥平台");
        l.children().eq(0).show()
    });
    Ext.getCmp("bufferAnalysis").on("expand",
    function() {
        e.setTitle("可视化勤务管理与作战指挥平台");
        l.children().eq(0).show()
    })
};