/** 
* Main JS For 可视化勤务管理与作战指挥平台
* @version v_1.0.1
* @author Lychee丶Lee
*/
/** 
* globalVariableConfigure, 全局变量配置
*/
var map;
/*图层*/
var layer, 
    pathLayer,
    markerLayer,
    heatMapLayer,
    polygonLayer,
    tiandituLayer, 
    drawLineLayer,
    drawPolygonLayer,
    animatorCarsLayer,
    bufferAnalysisLayer,
    bufferAnalysisMarkerLayer;
/*地图要素控件*/
var drawLine,
    drawPolygon;
/**
* 鼠标对象: 具有三个属性值, lon, lat, lonlat
* lon:    [SuperMap.LonLat.lon] 鼠标当前位置的纬度值
* lat:    [SuperMap.LonLat.lat] 鼠标当前位置的精度值
* lonlat: [SuperMap.LonLat]     鼠标当前位置的经纬度值
*/
var mouse = new Object();
    mouse.lon = null; 
    mouse.lat = null;
    mouse.lonlat = null;
/**
* 标绘对象: 具有三个属性, hasClass, alt, src
* hasClass: [boolean] 当前标绘是否具有单击样式
* alt:       [String] 当前标绘的alt属性值
* src:       [String] 当前标绘的src属性值
*/
var icon = new Object();
    icon.hasClass = false;
    icon.alt = '';
    icon.src = '';
    icon.marker = null;
    icon.centerMarker = null;
    icon.pathDemonstration = false;
/**
* 定位地点对象: 包含六个属性, layerName, placeName, placeCode, geometry, lon, lat
* layerName:              [String] 当前定位点所属图层名
* placeName:              [String] 当前定位点地址名
* placeCode:              [String] 当前定位点编码
*  geometry:   [SuperMap.Geometry] 当前定位点几何信息
*       lon: [SuperMap.LonLat.lon] 当前定位点的纬度
*       lat: [SuperMap.LonLat.lat] 当前定位点的经度
*/
var site = new Object();
    site.layerName = '';
    site.placeName = '';
    site.placeCode = '';
    site.lon = '';
    site.lat = '';
    site.geometry = '';
/*缓冲区分析结果数组*/
var bufferAnalysisArray = new Array();
/*路径节点数组*/
var pathPointArray = [];
/**
* 路径演示车辆对象: 包含六个属性, style, src, complate, startPoint, endPoint, oldCar
*       style:                  {String} 演示车辆样式
*         src:                  [String] 演示车辆的图片源
*    complate:                 [Boolean] 车辆演示完成标志
*  startPoint: [SuperMap.Geometry.Point] 车辆演示起点
*    endPoint: [SuperMap.Geometry.Point] 车辆演示终点
*      oldCar:         [SuperMap.Marker] 上一次路径演示的车辆
*/
var car = new Object();
    car.style = null;
    car.src = '';
    car.complate = false;
    car.startPoint = null;
    car.endPoint = null;
    car.oldCar = null;
/*服务地址*/
var url = "http://localhost:8090/iserver/services/map-sichuan/rest/maps/sichuan",
    urltdt = "http://localhost:8090/iserver/services/map-tianditu/rest/maps/影像底图_经纬度",
    neturl = "http://localhost:8090/iserver/services/transportationAnalyst-sichuan/rest/networkanalyst/NetDT@sichuan";
/** 
* Ext.onReady, 浏览器DOM就绪时触发，跨浏览器可兼容
* @param [Function fn, Scope scope, Object obj]
* @return []
*/
Ext.onReady(function() {
    pageInit();
    loadMap();
});
/**
* pageInit, Extjs构造主面板
* @para []
* @return []
*/
function pageInit() {
    /** 
    * 地图面板
    * 布局： fit
    * Region: center
    */
    var mapPanel = {
        xtype: "container",
        region: "center",
        layout: "fit",
        id: "centerRegionContainer",
        items: {
            title: "可视化勤务管理与作战指挥平台",
            titleAlign: "center",
            id: "mapPanel",
            region: "center",
        }
    };
    /**
    * 功能面板
    * 包括： 地图定位、缓冲区分析、救援相关、人防力量、现场视频、物资储备、北斗报文
    * 布局： accordion
    * Region: east
    */
    var mapLocalizationPanel = [ /*地图定位面板 布局：absolute*/
        {
            xtype: "combo",
            width: 250,
            store: ["成都", "自贡", "攀枝花", "德阳", "泸州", "绵阳", "广元", "遂宁", "内江", "南充", "眉山", "乐山", "宜宾", "广安", "达州", "雅安", "巴中", "资阳", "阿坝", "甘孜", "凉山"],
            value: "成都",
            id: "mapLocalizationCombo"
        },
        {
            xtype: "textfield",
            id: "mapLocalizationTextField",
            width: 150,
            emptyText: '输入查询地点'
        },
        {
            xtype: "button",
            text: "查找",
            width: 85,
            id: "queryBtn",
            handler: btnClickHandler
        }
    ];
    var bufferAnalysisPanel = [ /*缓冲区分析面板 布局：absolute*/
        {
            xtype: "combo",
            width: 250,
            store: ["米", "公里"],
            value: "公里",
            id: "bufferAnalysisCombo"
        },
        {
            xtype: "textfield",
            id: "bufferAnalysisTextField",
            width: 150,
            emptyText: '输入缓冲区分析半径'
        },
        {
            xtype: "button",
            text: "分析",
            width: 85,
            id: "bufferAnalysisBtn",
            handler: btnClickHandler
        }
    ];
    var specialGoalsPanel = [ /*特殊目标面板 布局：fit*/
        {
            xtype: "checkboxgroup",
            id: "specialGoalsCheckBoxGroup",
            layout: "fit",
            items: [
                {
                    boxLabel: "政府部门",
                    id: "governmentSectorCheckBox",
                    inputValue: "政府部门",
                    listeners: {
                        change: bufferAnalysis
                    }
                },
                {
                    boxLabel: "司法部门",
                    id: "judicialDepartmentsCheckBox",
                    inputValue: "公安消防",
                    listeners: {
                        change: bufferAnalysis
                    }
                },
                {
                    boxLabel: "医院",
                    id: "hospitalCheckBox",
                    inputValue: "医院",
                    listeners: {
                        change: bufferAnalysis
                    }
                },
                {
                    boxLabel: "学校",
                    id: "schoolCheckBox",
                    inputValue: "学校",
                    listeners: {
                        change: bufferAnalysis
                    }
                }
            ]
        }
    ];
    var serviceControlPanel = [ /*勤务管控面板 布局：fit*/
        {
            xtype: "checkboxgroup",
            layout: "fit",
            items: [
                {
                    boxLabel: "固定执勤点",
                    id: "fixedDutyPointCheckBox",
                    inputValue: "固定执勤点",
                    listeners: {
                        change: serviceControl
                    }
                },
                {
                    boxLabel: "执勤范围查询",
                    id: "queryDutyAreaCheckBox",
                    inputValue: "执勤范围查询",
                    listeners: {
                        change: serviceControl
                    }
                },
                {
                    boxLabel: "视频查勤",
                    id: "dutyVideoCheckBox",
                    inputValue: "视频查勤",
                    listeners: {
                        change: serviceControl
                    }
                }
            ]
        }
    ];
    var liveVideoPanle = [ /*现场视频面板 布局：fit*/
        {
            xtype: "checkboxgroup",
            layout: "fit",
            items: [
                {
                    boxLabel: "天网",
                    id: "skynetCheckBox",
                    inputValue: "天网",
                    listeners: {
                        change: bufferAnalysis
                    }
            
                },
                {
                    boxLabel: "无线图传",
                    id: "wirelessImageCheckBox",
                    inputValue: "无线图传",
                    listeners: {
                        change: bufferAnalysis
                    }
                }
            ]
        }
    ];
    var materialReservePanel = [ /*物资储备面板 布局：fit*/
        {
            xtype: "checkboxgroup",
            layout: "fit",
            items: [
                {
                    boxLabel: "药品",
                    id: "drugsCheckBox",
                    inputValue: "药品",
                    listeners: {
                        change: bufferAnalysis
                    }
                },
                {
                    boxLabel: "食品工具",
                    id: "foodToolsCheckBox",
                    inputValue: "食品工具",
                    listeners: {
                        change: bufferAnalysis
                    }
                },
                {
                    boxLabel: "交通工具",
                    id: "vehicleCheckBox",
                    inputValue: "交通工具",
                    listeners: {
                        change: bufferAnalysis
                    }
                },
                {
                    boxLabel: "救援器材",
                    id: "rescueEquipmentCheckBox",
                    inputValue: "救援器材",
                    listeners: {
                        change: bufferAnalysis
                    }
                }
            ]
        }
    ];
    var bigDipperMsgPanel = [ /*北斗报文面板 布局：absolute*/
        {
            xtype: "textarea",
            fieldLabel: '北斗报文',
            labelWidth: 60,
            id: "bigDipperMsgTextArea",
            width: 240,
            height: 120
        },
        {
            xtype: "combo",
            width: 240,
            fieldLabel: '发送对象',
            labelWidth: 60,
            store: ["一中队", "二中队", "三中队"],
            value: "一中队",
            id: "bigDipperMsgCombo",
        },
        {
            xtype: "button",
            text: "发送",
            width: 85,
            id: "sendBigDipperMsgBtn",
            handler: sendBigDipperMsg
        },
        {
            xtype: "button",
            text: "清空",
            width: 85,
            id: "clearBigDipperMsgBtn",
            handler: clearBigDipperMsg
        }
    ];
    var functionPanel = { 
        title: "功能面板",
        titleAlign: "center",
        id: "functionPanel",
        region: "east",
        weight: 10,
        width: 260,
        collapsible: true,
        frame: false,
        layout: {
            type: "accordion",
            animate: true
        },
        items: [
            {
                title: "地图定位",
                titleAlign: "center",
                width: 250,
                height: 125,
                collapsible: true,
                items: mapLocalizationPanel
            },
            {
                title: "缓冲区分析",
                titleAlign: "center",
                width: 250,
                height: 125,
                collapsible: true,
                collapsed: true,
                items: bufferAnalysisPanel
            },
            {
                xtype: "panel",
                title: "特殊目标",
                titleAlign: "center",
                items: specialGoalsPanel
            },
            {
                xtype: "panel",
                title: "勤务管控",
                titleAlign: "center",
                items: serviceControlPanel
            },
            {
                xtype: "panel",
                title: "现场视频",
                titleAlign: "center",
                items: liveVideoPanle
            },
            {
                xtype: "panel",
                title: "物资储蓄",
                titleAlign: "center",
                items: materialReservePanel
            },
            {
                xtype: "panel",
                title: "北斗报文",
                titleAlign: "center",
                items: bigDipperMsgPanel
            }
        ]
    };
    /**
    * 地图服务面板
    * 包括： 多元信息、视频会议、媒体视频、态势标图、图标部署
    * 布局控件： vbox
    */
    var multiInfoPanel = [ /*多元信息面板 布局：absolute*/
        {
            xtype: "button",
            text: "返回地图",
            id: "returnMapBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "民航信息",
            id: "civilAviationInfoBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "天气",
            id: "weatherBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "水文",
            id: "hydrologyBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "地震",
            id: "earthquakeBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "热力图",
            id: "thermodynamicChartBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "气象",
            id: "meteorologicalBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "新闻",
            id: "newsBtn",
            handler: btnClickHandler
        }
    ];
    var videoConferencingPanel = [ /*视频会议面板 布局：absolute*/
        { 
            xtype: "button",
            text: "总&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部",
            id: "headquartersBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "总&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;队",
            id: "cropsBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;队",
            id: "detachmentBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "中&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;队",
            id: "squadronBtn",
            handler: btnClickHandler
        }
    ];
    var mediaVideoPanle = [ /*媒体视频面板 布局：absolute*/
        {
            xtype: "button",
            text: "四川日报",
            id: "sichuanDailyBtn",
            handler: btnClickHandler
        },
        {
            xtype: "button",
            text: "成都日报",
            id: "chengduDailyBtn",
            handler: btnClickHandler
        }
    ];
    var mapServicePanel = {
        title: "地图服务",
        titleAlign: "center",
        id: "mapServicePanel",
        region: "west",
        weight: 10, 
        frame: false,
        layout: 'absolute',
        defaults: {
            width: 250
        },
        collapsible: true,
        items: [
            {
        
                title: "态势标图",
                id: "situationPlottingPanel",
                titleAlign: "center",
                width: 250,
                height: 80,
                frame: false,
                items: {
                    xtype: "combo",
                    width: 250,
                    id: "situationPlottingCombo",
                    store: ["灾害类型", "力量部署"],
                    value: "力量部署",
                    listeners: {
                        "select": situationPlottingComboChange
                    }
                }
            },
            {
                title: "图标部署",
                id: "iconDeploymentPanel",
                titleAlign: "center",
                width: 250,
                height: 148,
                frame: false
            }
        ]
    };
    /**
    * 通知区域面板
    * 包括： 北斗报文、查询结果、通信回执
    * 布局： column
    * Region：south
    */
    var notificationAreaPanel= { 
        id: "notificationAreaPanel",
        region: "south",
        weight: -1,
        height: 150,
        spilt: false,
        frame: false,
        layout: {
            type: "column",
            frame: false
        },
        items: [
            {
                title: "北斗报文",
                titleAlign: "center",
                id: "bigDipperMsgPanel",
                columnWidth: 0.1999999999999999,
                bodyStyle: "overflow-x:hidden;overflow-y:auto;",
                height: 148
            },
            {
                title: "查询结果",
                titleAlign: "center",
                id: "queryResultsPanel",
                columnWidth: 0.6,
                bodyStyle: "overflow-x:hidden;overflow-y:auto;",
                height: 148
            },
            {
                title: "通信回执",
                titleAlign: "center",
                id: "communicationReceiptPanel",
                columnWidth: 0.1999999999999999,
                bodyStyle: "overflow-x:hidden;overflow-y:auto;",
                height: 148
            }
        ]
    };
    /**
    * 可视化勤务管理与作战指挥平台主面板
    * 包括： 地图面板、功能面板、地图服务面板、通知区域面板
    * 控件： Ext.Viewport
    * 布局： Ext.border
    */
    Ext.create("Ext.Viewport", {
        layout: "border",
        defaults: {
            frame: false,
            split: true /*分割区域*/
        },
        items: [mapPanel, functionPanel, mapServicePanel, notificationAreaPanel]
    });
    /*添加子面板以自适应高度*/
    var servicePanel = Ext.getCmp('mapServicePanel');
    var mapServiceSubPanelHeight = $('#mapPanel-body').outerHeight() - 80;
    servicePanel.add(
        {
            frame: false,
            id: "subServicePannel",
            width: 250,
            height: mapServiceSubPanelHeight,
            layout: "accordion",
            items: [
                {
                    xtype: "panel",
                    title: "多元信息",
                    titleAlign: "center",
                    items: multiInfoPanel
                },
                {
                    xtype: "panel",
                    title: "视频会议",
                    titleAlign: "center",
                    items: videoConferencingPanel
                },
                {
                    xtype: "panel",
                    title: "媒体视频",
                    titleAlign: "center",
                    items: mediaVideoPanle
                }
            ]
        }
    );
    /**
    * 初始化态势标绘列表, 默认显示列表项为: 力量部署
    **/
    initStrengthDeploymentIcon();
    /**
    * 自动北斗报文_Demo
    */
    window.setInterval("autoBigDipperMsg()", 30 * 1000);
};
/**
* loadMap, 加载地图
* @para []
* @return []
*/
function loadMap() { 
    /*距离测量图层*/
    drawLineLayer = new SuperMap.Layer.Vector(
        "drawLineLayer",
        {
            displayInLayerSwitcher: false
        }
    );
    drawLineLayer.style = {
        strokeColor: "gray",
        strokeWidth: 2,
        pointerEvents: "visiblePainted",
        fillColor: "gray",
        fillOpacity: 1
    };
    /*面积测量图层*/
    drawPolygonLayer = new SuperMap.Layer.Vector(
        "drawPolygonLayer",
        {
            displayInLayerSwitcher: false
        }
    );
    drawPolygonLayer.style = {
        strokeColor: "gray",
        strokeWidth: 2,
        pointerEvents: "visiblePainted",
        fillColor: "#cecece",
        fillOpacity: 0.8
    };
    /*距离测量控件*/
    drawLine = new SuperMap.Control.DrawFeature(
        drawLineLayer, SuperMap.Handler.Path, 
        {
            multi: true
        }
    );
    drawLine.events.on(
        {
            "featureadded": drawLineCompleted
        }
    );
    /*面积测量控件*/
    drawPolygon = new SuperMap.Control.DrawFeature(
        drawPolygonLayer, 
        SuperMap.Handler.Polygon
    );
    drawPolygon.events.on(
        {
            "featureadded": drawPolygonCompleted
        }
    );
    /**
    * 实例化map类创建一个新地图, 实现地图在客户端的交互操作
    * 初始化图层, 添加控件
    */
    map = new SuperMap.Map("mapPanel-innerCt", {
        controls: [
            new SuperMap.Control.DragPan(), 
            new SuperMap.Control.ScaleLine(), 
            new SuperMap.Control.PanZoomBar(), 
            new SuperMap.Control.LayerSwitcher(), 
            new SuperMap.Control.SelectFeature(),
            new SuperMap.Control.MousePosition(), 
            new SuperMap.Control.Navigation(
                {
                    dragPanOptions: {
                        enableKinetic: true
                    }
                }
            ),
            drawLine, 
            drawPolygon
        ]
    });
    map.events.on({
        "click": mapClickHandler
    });
    map.events.on({
        "mousemove": setMousePosition
    });
    /*四川省矢量图层*/
    layer = new SuperMap.Layer.TiledDynamicRESTLayer(
        "矢量地图", 
        url, 
        {
            transparent: true,
            cacheEnabled: true
        },
        {
            maxResolution: "auto",
            scales: [
                1 / 1000, 
                1 / 2000, 
                1 / 4000, 
                1 / 6000, 
                1 / 8000, 
                1 / 10000, 
                1 / 12000, 
                1 / 14000, 
                1 / 16000, 
                1 / 18000,  
                1 / 20000, 
                1 / 25000, 
                1 / 30000, 
                1 / 35000, 
                1 / 40000, 
                1 / 45000, 
                1 / 50000, 
                1 / 60000, 
                1 / 80000, 
                1 / 4500000, 
                1 / 12000000
            ]
        }
    );
    layer.events.on({
        "layerInitialized": addLayer
    });
    /*天地图图层*/
    tiandituLayer = new SuperMap.Layer.TiledDynamicRESTLayer(
        "影像地图", 
        urltdt, 
        null, 
        {
            maxResolution: "auto"
        }
    );
    /*缓冲区分析画圆图层*/
    bufferAnalysisLayer = new SuperMap.Layer.Vector(
        "bufferAnalysisLayer",
        {
            displayInLayerSwitcher: false
        }
    );
    /*标绘图层*/
    markerLayer = new SuperMap.Layer.Markers(
        "markerLayer",
        {
            displayInLayerSwitcher: false
        }
    );
    /*缓冲区分析标绘图层*/
    bufferAnalysisMarkerLayer = new SuperMap.Layer.Markers(
        "bufferAnalysisMarkerLayer",
        {
            displayInLayerSwitcher: false
        }
    );
    /*热力图图层*/
    heatMapLayer = new SuperMap.Layer.HeatMapLayer(
        "heatMapLayer", 
        {
            displayInLayerSwitcher: false
        },
        {
            "featureWeight": "height",
            "featureRadius": "radius"
        }
    );
    /*热力图颜色配置*/
    var colors = [ 
        new SuperMap.REST.ServerColor(170, 255, 0), 
        new SuperMap.REST.ServerColor(255, 204, 0), 
        new SuperMap.REST.ServerColor(255, 153, 0),
        new SuperMap.REST.ServerColor(255, 51, 0), 
        new SuperMap.REST.ServerColor(255, 0, 0)
    ];
    heatMapLayer.colors = colors;
    /*车辆演示路径图层*/
    pathLayer = new SuperMap.Layer.Vector(
        "pathLayer",
        {
            displayInLayerSwitcher: false
        } 
    );
    /*执勤区域矢量图层*/
    polygonLayer = new SuperMap.Layer.Vector(
        "polygonLayer",
        {
            displayInLayerSwitcher: false
        } 
    );
    /**
    * 地图导航栏
    * 包括: 全幅显示, 距离测量, 面积测量, Vector清除
    */
    addMapNav('viewEntireControl', '全幅显示', 'viewEntire()');
    addMapNav('lineControl', '距离量算', 'distanceMeasure()');
    addMapNav('polygonControl', '面积量算', 'areaMeasure()');
    addMapNav('cleanControl', '清除', 'removeVectorFeatures()');
};
/**
* addLayer, 图层加载
* @para []
* @return []
*/
function addLayer() {
    map.addLayers(
        [
            layer, 
            tiandituLayer, 
            bufferAnalysisLayer,
            bufferAnalysisMarkerLayer,
            markerLayer,
            pathLayer,
            drawLineLayer,
            heatMapLayer,
            polygonLayer,
            drawPolygonLayer
        ]
    );
    /*设置地图中心点, 放大地图*/
    map.setCenter(new SuperMap.LonLat(103.065967, 30.25805), 0);
    map.zoomIn();
    
}
/**
* setMousePosition, 设置鼠标位置, 初始化mouse对象
* @para [event], mousemove事件对象
* @return []
*/
function setMousePosition(event) {
    var mouselonlat = map.getLonLatFromPixel(new SuperMap.Pixel(event.xy.x, event.xy.y));
    var regExp = /^\+?[1-9][0-9]*$/; /*正整数正则表达式*/
    var typeErrorMsg = "Type Error: Decimal should be an Integer !";
    /*返回当前鼠标位置的纬度值*/
    mouse.lon = function(decimal) {
        var isPositiveInteger = regExp.test(decimal);
        if (!isPositiveInteger) return typeErrorMsg;
        return mouselonlat.lon.toFixed(decimal);
    }
    /*返回当前鼠标位置的经度值*/
    mouse.lat = function(decimal) {
        var isPositiveInteger = regExp.test(decimal);
        if (!isPositiveInteger) return typeErrorMsg;
        return mouselonlat.lat.toFixed(decimal);
    }
    /*当前鼠标位置的经纬度值*/
    mouse.lonlat = function(decimal) {
        var lon = mouselonlat.lon.toFixed(decimal);
        var lat = mouselonlat.lat.toFixed(decimal);
        return new SuperMap.LonLat(lon, lat);
    }
}; 
/**
* btnClickHandler, 按钮单击回调函数
* @para [currentBtn], btnClickHandler接受一个参数, 即当前被单击的btn
* @return [currentBtnValue], 返回当前button的值
*/
function btnClickHandler(currentBtn) {
    /*获取当前button值, 根据值判断需要触发的事件*/
    var currentBtnValue = currentBtn.text;
    switch(currentBtnValue) {
        case "返回地图":
            backToMap();
            break;
        case "民航信息":
            civilAviationInfo();
            break;
        case "天气":
            weatherWin();
            break;
        case "水文":
            waterConservancyWin();
            break;
        case "地震":
            earthQuakeWin();
            break;
        case "热力图":
            thermodynamicChart();
            break;
        case "气象":
            meteorologicalWin();
            break;
        case "新闻":
            newsWin();
            break;
        case "呼叫":
            callCivAirDefense();
            break;
        case "查找":
            locationMapByQueryPlace();
            break;
        case "分析":
            bufferAnalysis();
            break;
        case "四川日报":
            sichuanDailyWin();
            break;
        case "成都日报":
            chengduDailyWin();
            break;
        case "总&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部":
        case "总&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;队":
        case "中&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;队":
        case "支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;队":
            callCivAirDefense();
            break;
        default:
            return currentBtnValue;
    }
};
/**
* initSubIframe, iframe窗口实现外链页面
* @para [title, url], iframe窗口的标题, iframe源地址
* @return []
*/
function initSubIframe(title, url) {
    hideMapNav();
    var mapPanelTitle = title;
    var $mapPanel = $("#mapPanel-innerCt");
    var $mapPanelViewPort = $("#SuperMap.Map_17_SuperMap_Viewport");
    var mapPanel = Ext.getCmp("mapPanel");
    var mapPanelChildren = $mapPanel.children().eq(1);
    if (mapPanelChildren.length > 0) mapPanelChildren.remove();
    $mapPanel.children().eq(0).hide();
    var contentHtml = "<iframe id='iframe' frameborder='0' height='100%' width='100%' scrolling='auto' frameorder='0'";
    contentHtml += "src='" + url + "'" + "></iframe>";
    $mapPanel.append(contentHtml);
    mapPanel.setTitle(mapPanelTitle);
};
/**
* showMapNav, 显示地图导航栏
* @para []
* @return []
*/
function showMapNav() {
    $("#viewEntireControl").show();
    $("#lineControl").show();
    $("#polygonControl").show();
    $("#cleanControl").show();
}
/**
* hideMapNav, 隐藏地图导航栏
* @para []
* @return []
*/
function hideMapNav() {
    $("#viewEntireControl").hide();
    $("#lineControl").hide();
    $("#polygonControl").hide();
    $("#cleanControl").hide();
}
/**
* backToMap, 返回地图, 移除热力图
* @para []
* @return []
*/
function backToMap() {
    var $mapPanel = $("#mapPanel-innerCt");
    var mapPanel = Ext.getCmp("mapPanel");
    mapPanel.setTitle("可视化勤务管理与作战指挥平台");
    $mapPanel.children().eq(0).show();
    showMapNav();
    heatMapLayer.removeAllFeatures();
};
/**
* civilAviationInfo, 民航信息窗口
* @para []
* @return []
*/
function civilAviationInfo() {
    initSubIframe("民航信息", "http://zh.flightaware.com/live/map");
};
/**
* weatherWin, 天气信息窗口
* @para []
* @return []
*/
function weatherWin() {
    var host = "https://earth.nullschool.net/#current/";
    var url = host + "wind/surface/level/overlay=temp/orthographic=-262.65,31.21,1466";
    initSubIframe("天气", url)
};
/**
* waterConservancyWin, 水文信息窗口
* @para []
* @return []
*/
function waterConservancyWin() {
    initSubIframe("水文测报", "http://www.schwr.com/swcb/");
};
/**
* earthQuakeWin, 地震信息窗口
* @para []
* @return []
*/
function earthQuakeWin() {
    initSubIframe("地震", "http://www.ceic.ac.cn/onmap/id:1")
};
/**
* thermodynamicChart, 当前区域的热力图
* @para []
* @return []
*/
function thermodynamicChart() {
    backToMap();
    var tianFuSquarePoint = [
        new SuperMap.Geometry.Point(104.077857, 30.657068), 
        new SuperMap.Geometry.Point(104.077732, 30.655043), 
        new SuperMap.Geometry.Point(104.079865, 30.662601), 
        new SuperMap.Geometry.Point(104.077895, 30.657125), 
        new SuperMap.Geometry.Point(104.076156, 30.654252), 
        new SuperMap.Geometry.Point(104.077807, 30.656354), 
        new SuperMap.Geometry.Point(104.078355, 30.657302), 
        new SuperMap.Geometry.Point(104.078159, 30.657006), 
        new SuperMap.Geometry.Point(104.075812, 30.655138), 
        new SuperMap.Geometry.Point(104.076799, 30.655214), 
        new SuperMap.Geometry.Point(104.076911, 30.655442), 
        new SuperMap.Geometry.Point(104.078853, 30.655171), 
        new SuperMap.Geometry.Point(104.074669, 30.653991)
    ];
    var chunXiRoadPoint = [
        new SuperMap.Geometry.Point(104.065967, 30.658051), 
        new SuperMap.Geometry.Point(104.064494, 30.657438), 
        new SuperMap.Geometry.Point(104.065812, 30.657868), 
        new SuperMap.Geometry.Point(104.065853, 30.657105), 
        new SuperMap.Geometry.Point(104.066658, 30.656925), 
        new SuperMap.Geometry.Point(104.065544, 30.655812), 
        new SuperMap.Geometry.Point(104.066277, 30.655905), 
        new SuperMap.Geometry.Point(104.063142, 30.657658), 
        new SuperMap.Geometry.Point(104.065967, 30.658051), 
        new SuperMap.Geometry.Point(104.059585, 30.657893), 
        new SuperMap.Geometry.Point(104.065967, 30.658051), 
        new SuperMap.Geometry.Point(104.066463, 30.655023), 
        new SuperMap.Geometry.Point(104.067657, 30.658657), 
        new SuperMap.Geometry.Point(104.065211, 30.659731), 
        new SuperMap.Geometry.Point(104.065920, 30.661011), 
        new SuperMap.Geometry.Point(104.065780, 30.661921), 
        new SuperMap.Geometry.Point(104.067061, 30.659821), 
        new SuperMap.Geometry.Point(104.069175, 30.658716)
    ];
    var SCPGPoint = [
        new SuperMap.Geometry.Point(104.06518, 30.57808), 
        new SuperMap.Geometry.Point(104.06594, 30.57656), 
        new SuperMap.Geometry.Point(104.06622, 30.57874), 
        new SuperMap.Geometry.Point(104.06409, 30.57504), 
        new SuperMap.Geometry.Point(104.06556, 30.57627), 
        new SuperMap.Geometry.Point(104.06342, 30.57708), 
        new SuperMap.Geometry.Point(104.06328, 30.57798), 
        new SuperMap.Geometry.Point(104.06703, 30.57779), 
        new SuperMap.Geometry.Point(104.06504, 30.57451), 
        new SuperMap.Geometry.Point(104.06760, 30.57537), 
        new SuperMap.Geometry.Point(104.06808, 30.57637)
    ];
    var tianFuSquareVectorFeatures = initThermodynamicChartArray(tianFuSquarePoint);
    var chunXiRoadVectorFeatures = initThermodynamicChartArray(chunXiRoadPoint);
    var SCPGVectorFeatures = initThermodynamicChartArray(SCPGPoint);
    heatMapLayer.addFeatures(tianFuSquareVectorFeatures);
    heatMapLayer.addFeatures(chunXiRoadVectorFeatures);
    heatMapLayer.addFeatures(SCPGVectorFeatures);
    /*map.addLayer(heatMapLayer);*/
};
/**
* initThermodynamicChartArray, 构造热力图区域点数组
* @para []
* @return []
*/
function initThermodynamicChartArray(pointArray) {
    var length = pointArray.length;
    var heatMapVectorFeatures = [];
    if (!length) return "Point Array is null!";
    for (var i = 0; i < length; i++) {
        var pointVector = new SuperMap.Feature.Vector(
            pointArray[i],
            {
                "height": Math.random() * 9,
                "radius": Math.random() * 50 - 30 
            }
        );
        heatMapVectorFeatures.push(pointVector);
    }
    return heatMapVectorFeatures;
}
/**
* meteorologicalWin, 气象信息窗口
* @para []
* @return []
*/
function meteorologicalWin() {
    var host = "https://earth.nullschool.net/#current/chem/surface/level/"
    var url = host + "overlay=pm10/orthographic=-262.65,31.21,1466/loc=112.131,28.075";
    initSubIframe("气象", url);
};
/**
* newsWin, 新闻信息窗口
* @para []
* @return []
*/
function newsWin() {
    initSubIframe("新闻", "http://www.newssc.org/map.html");
};
/**
* callCivAirDefense, 呼叫人防办
* @para []
* @return []
*/
function callCivAirDefense() {
    initSubIframe("呼叫", "./source/pages/Civil Air Defense.html");
};
/**
* sichuanDailyWin, 四川日报窗口
* @para []
* @return []
*/
function sichuanDailyWin() {
    initSubIframe("四川日报", "http://epaper.scdaily.cn");
};
/**
* chengduDailyWin, 成都日报窗口
* @para []
* @return []
*/
function chengduDailyWin() {
    initSubIframe("成都日报", "http://www.cdrb.com.cn");
};
/**
* situationPlottingComboChange, 切换态势标图标绘
* @para []
* @return []
*/
function situationPlottingComboChange(combo) {
    var comboValue = combo.getValue();
    if (!comboValue) return false;
    /*清空默认列表, 根据comboValue值动态切换列表*/
    $("#iconDeploymentPanel-innerCt").empty();
    if (comboValue == '力量部署') {
        initStrengthDeploymentIcon();
    } else {
        initDisasterTypesIcon();
    }
    /*当前标绘列表属于哪个combo*/
    icon.parentCombo = comboValue;
};
/**
* initSituationPlottingIcon, 初始化态势标图标绘
* @para [src, alt, clickHandler, parentPanel], 标绘源地址, alt属性, 图片列表样式, 单击回调函数, 放置标绘的面板
* @return []
*/
function initSituationPlottingIcon(src, alt, cls, clickHandler, parentPanel) {
    var children = " ";
    children += '<img src="' + src + '" alt="' + alt + '" class="' + cls + '" onclick="' + clickHandler + '" />';
    $("#" + parentPanel + "-innerCt").append(children);
}
/**
* initIconStrengthDeployment, 力量部署标绘列表
* @para []
* @return []
*/
function initStrengthDeploymentIcon() {
    var parentPanel = "iconDeploymentPanel";
    var clickHanlder = "situationPlottingIconClickHandler(this)";
    var cls = "strengthDeploymentImg";
    initSituationPlottingIcon("./images/ambulance.png", "ambulance", cls, clickHanlder, parentPanel);
    initSituationPlottingIcon("./images/fire_engine.png", "fire_engine", cls, clickHanlder, parentPanel);
    initSituationPlottingIcon("./images/police_car.png", "police_car", cls, clickHanlder, parentPanel);
    initSituationPlottingIcon("./images/wrecking_car.png", "wrecking_car", cls, clickHanlder, parentPanel);
    initSituationPlottingIcon("./images/barricade.png", "barricade", cls, clickHanlder, parentPanel);
    initSituationPlottingIcon("./images/command.png", "command", cls, clickHanlder, parentPanel);
}
/**
* initDisasterTypesIcon, 灾害类型标绘列表
* @para []
* @return []
*/
function initDisasterTypesIcon() {
    var parentPanel = "iconDeploymentPanel";
    var clickHanlder = "situationPlottingIconClickHandler(this)";
    var cls = "disasterTypesImg";
    initSituationPlottingIcon("./images/drought.png", "drought", cls, clickHanlder, parentPanel);
    initSituationPlottingIcon("./images/earth_qk.png", "earth_qk", cls, clickHanlder, parentPanel);
    initSituationPlottingIcon("./images/fire.png", "fire", cls, clickHanlder, parentPanel);
    initSituationPlottingIcon("./images/flood.png", "flood", cls, clickHanlder, parentPanel);
    initSituationPlottingIcon("./images/geol_dis.png", "geol_dis", cls, clickHanlder, parentPanel);
    initSituationPlottingIcon("./images/met_dis.png", "met_dis", cls, clickHanlder, parentPanel);
}
/**
* situationPlottingIconClickHandler, 态势标图标绘单击回调函数, 初始化标绘对象, 切换标绘样式
* @para [this], 当前被单击的标绘
* @return []
*/
function situationPlottingIconClickHandler(whichIcon) {
    icon.hasClass = $(whichIcon).hasClass("iconClicked");
    icon.alt = whichIcon.getAttribute("alt");
    icon.src = whichIcon.getAttribute("src");
    toggleIconStyle(whichIcon);
}
/**
* toggleIconStyle, 切换标绘样式
* @para [whichIcon], 当前被单击的标绘
* @return []
*/
function toggleIconStyle(whichIcon) {
    /*当前icon已有单击样式, 说明当前icon已经准备好部署, 可以单击地图部署icon*/
    var hasClass = icon.hasClass;
    if (hasClass) {
        whichIcon.classList.remove("iconClicked");
        icon.hasClass = false;
    } else {
        /**
        * clickedIcon, 已单击的icon
        * 先移除已单击icon的样式, 再为当前icon添加样式
        */
        var clickedIcon = document.querySelectorAll(".iconClicked");
        var len = clickedIcon.length;
        for (var i = 0; i < len; i++) {
            clickedIcon[i].classList.remove("iconClicked");
        }
        whichIcon.classList.add("iconClicked");
        icon.hasClass = true;
    }
}
/**
* deploymentIcon, 部署标绘
* @para []
* @return []
*/
function deploymentIcon() {
    if (icon.unDeployment == true) {
        icon.unDeployment = false;
        return
    };
    var iconSize = null;
    var strengthDeploymentIconSize = new SuperMap.Size(45, 18);
    var disasterTypesIconSize = new SuperMap.Size(32, 32);
    var markerlon = mouse.lon(6);
    var markerlat = mouse.lat(6);
    var parentCombo = icon.parentCombo;
    (parentCombo == "灾害类型") ? (iconSize = disasterTypesIconSize) : (iconSize = strengthDeploymentIconSize);
    var marker = initMarker(iconSize, icon.src, markerlon, markerlat);
    markerLayer.addMarker(marker);
    marker.src = icon.src;
    marker.alt = icon.alt;
    marker.lon = markerlon;
    marker.lat = markerlat;
    marker.events.on(
        {
            "click": mapIconClickHandler,
              scope: marker
        }
    );
}
/**
* initMarker, 构造标绘
* @para [size, src, lon, lat, layer]
* size :          [SuperMap.Size] 标绘大小
* src  :                 [String] 标绘图片的源地址
* lon  :    [SuperMap.LonLat.lon] 标绘部署的纬度坐标值
* lat  :    [SuperMap.LonLat.lat] 标绘部署的经度坐标值
* @return       [SuperMap.Marker] 返回SuperMap.Marker
*/
function initMarker(size, src, lon, lat) {
    if (!size || !src || !lon || !lat || !layer) return;
    var pixel = new SuperMap.Pixel( - (size.w / 2), -size.h);
    var icon = new SuperMap.Icon(src, size, pixel);
    var marker = new SuperMap.Marker(new SuperMap.LonLat(lon, lat), icon);
    return marker;
}
/**
* mapIconClickHandler, 地图标绘单击回调事件, 保存当前位置节点, 构造标绘事件窗口
* @para []
* @return []
*/
function mapIconClickHandler() {
    /*如果当前有标绘正在进行路径演示, 需要等路径演示完成*/
    if (icon.pathDemonstration) {
        if (!car.complate) {
            $('#communicationReceiptPanel-innerCt').empty();
            $('#communicationReceiptPanel-innerCt').append('请等待当前车辆路径演示完成 !')
            return;
        }
    }
    /*当前标绘*/
    icon.marker = this;
    /*单击地图标绘时标绘为不可部署状态*/
    icon.unDeployment = true;
    /*清空路径数组, 保存当前标绘位置*/
    pathPointArray = [];
    var startPoint = new SuperMap.Geometry.Point(this.lon, this.lat)
    pathPointArray.push(startPoint);
    /*构造事件窗口*/
    initMarkerWin(this);
}
/**
* mapIconClickHandler, 构造标绘事件窗口
* @para []
* @return []
*/
function initMarkerWin(marker) {
    var alt = marker.alt;
    if (!alt) return false;
    icon.alt = alt;
    var contenHtml = '';
    var size = null;
    if (alt === "ambulance" || alt === "fire_engine" || alt === "police_car" || alt === "wrecking_car") {
        contenHtml += '<input type="button" id="unDeploymentBtn" value="取消部署" onClick="unDeployment()"></input>';
        contenHtml += '<input type="button" id="pathDemonstrationBtn" value="路径演示" onClick="pathDemonstration(this)"></input>';
        contenHtml += '<input type="button" id="clearIconBtn" value="清空标绘" onClick="clearIcon()"></input>';
        size = new SuperMap.Size(240, 35);
    } else {
        contenHtml += '<input type="button" id="unDeploymentBtn" value="取消部署" onClick="unDeployment()"></input>';
        contenHtml += '<input type="button" id="clearIconBtn" value="清空标绘" onClick="clearIcon()"></input>';
        size = new SuperMap.Size(160, 35);
    }
    var markerWin = new SuperMap.Popup.FramedCloud(
        "markerWin", 
        mouse.lonlat(6),
        size,
        contenHtml,
        null,
        true,
        null,
        true
    );
    markerWin.autoSize = false;
    closeMapPopups();
    map.addPopup(markerWin);
}
/**
* mapIconClickHandler, 构造标绘事件窗口
* @para []
* @return []
*/
function unDeployment() {
    /*当前标绘*/
    closeMapPopups();
    var currentMarker = icon.marker;
    if (!currentMarker) return;
    markerLayer.removeMarker(currentMarker);
}
/**
* clearIcon, 清空地图标绘
* @para []
* @return []
*/
function clearIcon() {
    closeMapPopups();
    markerLayer.clearMarkers();
    $('#communicationReceiptPanel-innerCt').empty();
    if (icon.centerMarker) markerLayer.addMarker(icon.centerMarker);
    /*如果存在车辆演示图层且路径演示完成, 移除该图层*/
    if (car.removeLayer && car.complate) {
        map.removeLayer(animatorCarsLayer);
        pathLayer.removeAllFeatures();
        car.removeLayer = false;
        car.complate = true;
        car.pathDemonstration = false;
        car.oldCar = null;
        car.src = '';
        car.alt = '';
    }
}
/**
* pathDemonstration, 路径演示
* @para []
* @return []
*/
function pathDemonstration() {
    if (!site.lon || !site.lat) {
        Ext.MessageBox.alert('系统提示', '请选择路径演示终点 !');
        closeMapPopups();
        return;
    }
    closeMapPopups();
    /*演示完成后还原车辆初始位置*/
    if (car.complate) {
        if(car.oldCar) markerLayer.addMarker(car.oldCar);
        car.complate = false;
    }
    /*移除上一次的演示图层以及路径*/
    if (car.removeLayer) {
        map.removeLayer(animatorCarsLayer);
        pathLayer.removeAllFeatures();
        car.removeLayer = false;
    }
    /*构造路径起始点数组, 作为查询节点参数*/
    var incidentSitePoint = new SuperMap.Geometry.Point(site.lon, site.lat);
    pathPointArray.push(incidentSitePoint);
    /*保存车辆信息, 移除当前演示的车辆*/
    if (icon.marker) {
        car.oldCar = icon.marker;
        car.alt = icon.alt;
        car.src = icon.src;
        car.pathSrc = './images/' + icon.alt + '_path.png';
        car.startPoint = pathPointArray[0];
        car.endPoint = pathPointArray[1];
        car.style = initCarStyle(car.pathSrc, 18, 45);
        markerLayer.removeMarker(icon.marker);
    }
    /*最佳路径查询*/
    queryBestLine(pathPointArray);
    icon.pathDemonstration = true;
}
/**
* queryBestLine, 最佳路径查询
* @para [pathPointArray], 路径起始点数组
* @return []
*/
function queryBestLine(nodeArray) {
    var resultSetting = new SuperMap.REST.TransportationAnalystResultSetting(
        {
            returnEdgeFeatures: true,
            returnEdgeGeometry: true,
            returnEdgeIDs: true,
            returnNodeFeatures: true,
            returnNodeGeometry: true,
            returnNodeIDs: true,
            returnPathGuides: true,
            returnRoutes: true
        }
    );
    var param = new SuperMap.REST.TransportationAnalystParameter(
        {
            resultSetting: resultSetting
        }
    );
    var findPathParam = new SuperMap.REST.FindPathParameters(
        {
            isAnalyzeById: false,
            nodes: nodeArray,
            hasLeastEdgeCount: false,
            parameter: param
        }
    );
    var service = new SuperMap.REST.FindPathService(
        neturl, 
        {
            eventListeners: 
            {
                "processCompleted": findPathCompleted,
                "processFailed": findPathFailed
            }
        }
    );
    service.processAsync(findPathParam);
}
/**
* findPathCompleted, 最佳路径查询成功, 查询结果处理
* @para [findPathEventArgs], 最佳路径分析结果数据
* @return []
*/
function findPathCompleted(findPathEventArgs) {
    var result = findPathEventArgs.result;
    var len = result.pathList.length;
    if (!len) return;
    var pathGuideItems = result.pathList[0].pathGuideItems;
    var itemsLen = pathGuideItems.length;
    if (!itemsLen) return;
    /*车辆路径节点数组*/
    var featuresCar = [];
    /*路径节点数组*/
    var featuresRoute = [];
    for (var i = 0; i < itemsLen; i++) {
        var feature = new SuperMap.Feature.Vector();
        feature.geometry = pathGuideItems[i].geometry;
        if (!feature.geometry) return;
        if (feature.geometry.CLASS_NAME === "SuperMap.Geometry.Point") {
            var point = feature.geometry;
            featuresRoute.push(point);
            var node = new SuperMap.Feature.Vector(
                point, 
                {
                    FEATURDID: "point",
                    TIME: i
                },
                car.style
            );
            featuresCar.push(node);
        }
    }
    /*显示最佳路径*/
    /*路径样式*/
    var styleLine = {
        strokeColor: "blue",
        strokeWidth: 2,
        pointerEvents: "visiblePainted",
        fillColor: "yellow",
        fillOpacity: 1.0
    };
    var pathFeature=  new SuperMap.Feature.Vector();
    var line = new SuperMap.Geometry.LineString(featuresRoute);
    pathFeature.geometry = line;
    pathFeature.style = styleLine;
    pathLayer.addFeatures(pathFeature);
    /*路径演示车辆图层*/
    animatorCarsLayer = new SuperMap.Layer.AnimatorVector(
        "Cars", 
        {
            displayInLayerSwitcher : false
        },
        {
            speed: 0.04,
            startTime: 0,
            endtime: 100
        }
    );
    animatorCarsLayer.addFeatures(featuresCar);
    map.addLayer(animatorCarsLayer);
    animatorCarsLayer.animator.start();
    /*路径开始演示, 下一次路径演示时移除当前车辆演示图层*/
    car.removeLayer = true;
    animatorCarsLayer.events.on(
        {
            "drawfeaturestart": drawFeatureStart
        }
    );
    animatorCarsLayer.animator.setRepeat(false);
    $('#communicationReceiptPanel-innerCt').empty();
    $('#communicationReceiptPanel-innerCt').append('路径演示');
}
/**
* drawFeatureStart, 路径节点绘制监听事件
* @para []
* @return []
*/
function drawFeatureStart(path) {
    var geometry = path.geometry;
    if (!geometry) return;
    /**
    * 车辆抵达事发点时停止, 路径演示完成
    * 通过监听车辆经过的最后一个节点(事发点)是否绘制, 来判断车辆是否到达事发点
    */
    if (geometry.x == site.lon && geometry.y == site.lat) {
        car.complate = true;
        icon.pathDemonstration = false;
        animatorCarsLayer.animator.stop();
    }
}
/**
* initCarStyle, 构造演示车辆样式
* @para []
* @return []
*/
function initCarStyle(src, width, height) {
    if (!src) return;
    var style = {
        externalGraphic: src,
        allowRotate: true,
        graphicWidth: width,
        graphicHeight: height
    };
    return style;
}
/**
* findPathFailed, 最佳路径查询失败
* @para []
* @return []
*/
function findPathFailed(e) {
    $('#communicationReceiptPanel-innerCt').empty();
    $('#communicationReceiptPanel-innerCt').append('路径查询失败' + '</br>' + e.error.Msg);
}
/**
* closeMapPopup, 关闭地图上弹窗
* @para []
* @return []
*/
function closeMapPopups() {
    var popups = map.popups ;
    if (!popups) return;
    var len = popups.length;
    if (!len) return;
    for (var i = 0; i < len; i++) {
        popups[i].hide();
        popups[i].destroy();
    }
    return len;
}
/**
* addMapNav, 添加地图导航控件
* @para [id, title, clickHandler], 控件id, 控件标题, 控件单击回调函数
* @return []
*/
function addMapNav(id, title, clickHandler) {
    var $mapPanelBody = $("#mapPanel-body");
    var children = "";
    children += '<a id="';
    children += id + '"' + 'title="' + title + '"' + 'onclick="';
    children += clickHandler + '"' + '></a>';
    $mapPanelBody.append(children);
}
/**
* viewEntire, 地图全幅显示
* @para []
* @return [error], mapZoomLevels is undefined !
*/
function viewEntire() {
    /*地图的放大级别, 缩小地图到最大级别实现全幅显示*/
    var mapZoomLevels = map.getNumZoomLevels();
    if (!mapZoomLevels) {
        return "get mapZoomLevel failed!";
    }
    for (var i = 0; i < mapZoomLevels ; i++) {
        map.zoomOut();
    }
}
/**
* distanceMeasure, 距离量算
* @para []
* @return []
*/
function distanceMeasure() {
    drawLineLayer.removeAllFeatures();
    drawLine.activate();
}
/**
* areaMeasure, 面积量算
* @para []
* @return []
*/
function areaMeasure() {
    drawPolygonLayer.removeAllFeatures();
    drawPolygon.activate();
}
/**
* drawLineCompleted, 距离量算线绘制完成, measureService查询
* @para [line], drawGeometryArgs
* @return []
*/
function drawLineCompleted(line) {
    drawLine.deactivate();
    var geometry = line.feature.geometry,
    measureParameters = new SuperMap.REST.MeasureParameters(geometry),
    measureService = new SuperMap.REST.MeasureService(url);
    measureService.events.on(
        {
            "processCompleted": distanceMeasureCompleted
        }
    );
    measureService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;
    measureService.processAsync(measureParameters)
}
/**
* drawPolygonCompleted, 面积量算线绘制完成, measureService查询
* @para [polygon], drawGeometryArgs
* @return []
*/
function drawPolygonCompleted(polygon) {
    drawPolygon.deactivate();
    var geometry = polygon.feature.geometry,
    measureParameters = new SuperMap.REST.MeasureParameters(geometry),
    measureService = new SuperMap.REST.MeasureService(url);
    measureService.events.on(
        {
            "processCompleted": areaMeasureCompleted
        }
    );
    measureService.measureMode = SuperMap.REST.MeasureMode.AREA;
    measureService.processAsync(measureParameters)
}
/**
* distanceMeasureCompleted, 距离量算完成
* @para [queryEventArgs], 查询结果数组
* @return [unit] Error: unit is not legal !
*/
function distanceMeasureCompleted(queryEventArgs) {
    var $communicationReceiptPanel = $("#communicationReceiptPanel-innerCt");
    $communicationReceiptPanel.empty();
    $communicationReceiptPanel.append("量算结果: ");
    var distance = queryEventArgs.result.distance.toFixed(2);
    var unit = queryEventArgs.result.unit;
    var KilometerDistance = (distance / 1000).toFixed(2);
    if (unit == "METER") {
        if (KilometerDistance < 1) {
            $communicationReceiptPanel.append(distance + " 米")
        } else {
            $communicationReceiptPanel.append(KilometerDistance + " 千米")
        }
    } else {
        return "Unit Error: " + unit;
    }
}
/**
* areaMeasureCompleted, 面积量算完成
* @para [queryEventArgs], 查询结果数组
* @return [unit] Error: unit is not legal !
*/
function areaMeasureCompleted(queryEventArgs) {
    var $communicationReceiptPanel = $("#communicationReceiptPanel-innerCt");
    $communicationReceiptPanel.empty();
    $communicationReceiptPanel.append("量算结果: ");
    var area = queryEventArgs.result.area.toFixed(2);
    var unit = queryEventArgs.result.unit;
    var squareKilometreArea = (area / 100000).toFixed(2);
    if (unit == "METER") {
        if (squareKilometreArea < 1) {
            $communicationReceiptPanel.append(area + " 平方米")
        } else {
            $communicationReceiptPanel.append(squareKilometreArea + " 平方千米")
        }
    } else {
        return "Unit Error: " + unit;
    }
}
/**
* removeVectorFeatures, 清除面积量算和距离量算矢量要素
* @para []
* @return []
*/
function removeVectorFeatures() {
    drawLineLayer.removeAllFeatures();
    drawPolygonLayer.removeAllFeatures();
    $("#communicationReceiptPanel-innerCt").empty();
}
/**
* mapClickHandler, 地图单击事件
* @para []
* @return []
*/
function mapClickHandler() {
    closeMapPopups();
    /*标绘没有单击(样式)时不可部署*/
    if (icon.hasClass) deploymentIcon();
};
/**
* autoBigDipperMsg, 自动北斗报文
* @para []
* @return []
*/
function autoBigDipperMsg() {
    var date = new Date();
    var currentTime = date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds();
    var formTime = "收到报文-" + currentTime + "</br>";
    $("#bigDipperMsgPanel-innerCt").append(formTime);
}
/**
* locationMapByQueryPlace, 通过输入地点名称字段定位地图
* @para []
* @return []
*/
function locationMapByQueryPlace() {
    /*清空缓存*/
    closeMapPopups();
    clearIcon();
    removeVectorFeatures();
    bufferAnalysisLayer.removeAllFeatures();
    bufferAnalysisMarkerLayer.clearMarkers();
    pathLayer.removeAllFeatures();
    $('#queryResultsPanel-innerCt').empty();
    bufferAnalysisArray = [];
    site.placeName = '';
    car.oldCar = null;
    if (car.removeLayer) {
        map.removeLayer(animatorCarsLayer);
        pathLayer.removeAllFeatures();
        car.removeLayer = false;
    }
    /*查询地址不能为空*/
    var queryPlace = $('#mapLocalizationTextField-inputEl').val();
    if (!queryPlace) {
        Ext.MessageBox.alert('系统提示', '请输入关键字后再进行查询!');
        return false;
    }
    /*小的交互效果*/
    map.setCenter(new SuperMap.LonLat(103.065967, 30.25805), 0);
    map.zoomIn();
    /*构造查询参数*/
    var queryParam = initQueryParam(queryPlace);
    /*REST查询*/
    var queryService = new SuperMap.REST.QueryBySQLService(
        url, 
        {
            eventListeners: 
            {
                "processCompleted": sqlQueryCompleted,
                "processFailed": sqlQueryFailed
            }
        }
    );
    queryService.processAsync(queryParam);
};
/**
* initQueryParam, 获得查询城市和地点, 构造SQL查询参数, 构造REST查询参数
* @para []
* @return [filterParameter], 返回REST查询参数 SuperMap.REST.FilterParameter
*/
function initQueryParam(queryPlace) {
    var queryCity = $('#mapLocalizationCombo-inputEl').val();
    var queryPlace = queryPlace;
    var formatPlace = '%';
    /*构造SQL查询参数*/
    var queryPlaceLength = queryPlace.length;
    if (!queryPlaceLength) return;
    for (var i = 0; i < queryPlaceLength; i++) {
        formatPlace += queryPlace.substring(i, i+1) + '%';
    }
    var formatCity = getCityCodeByName(queryCity);
    var sqlParam = "Name Like'" + formatPlace + "' and Code Like " + formatCity;
    /*构造REST查询参数*/
    /*查询图层数组*/
    var layers = initQueryLayersArray(sqlParam);
    var queryParam = new SuperMap.REST.QueryBySQLParameters({
        queryParams: layers,
        expectCount: 10000
    });
    return queryParam;
}
/**
* getCityCodeByName, 通过城市名返回城市编号
* @para [cityName], 城市名
* @return [cityCode], 城市编号
*/
function getCityCodeByName(cityName) {
    var cityCode = '';
    switch (cityName) {
        case "成都":
            cityCode = "'5101%'";
            break;
        case "自贡":
            cityCode = "'5103%'";
            break;
        case "攀枝花":
            cityCode = "'5104%'";
            break;
        case "泸州":
            cityCode = "'5105%'";
            break;
        case "德阳":
            cityCode = "'5106%'";
            break;
        case "绵阳":
            cityCode = "'5107%'";
            break;
        case "广元":
            cityCode = "'5108%'";
            break;
        case "遂宁":
            cityCode = "'5109%'";
            break;
        case "内江":
            cityCode = "'5110%'";
            break;
        case "乐山":
            cityCode = "'5111%'";
            break;
        case "南充":
            cityCode = "'5113%'";
            break;
        case "眉山":
            cityCode = "'5114%'";
            break;
        case "宜宾":
            cityCode = "'5115%'";
            break;
        case "广安":
            cityCode = "'5116%'";
            break;
        case "达州":
            cityCode = "'5117%'";
            break;
        case "雅安":
            cityCode = "'5118%'";
            break;
        case "巴中":
            cityCode = "'5119%'";
            break;
        case "资阳":
            cityCode = "'5120%'";
            break;
        case "阿坝":
            cityCode = "'5132%'";
            break;
        case "甘孜":
            cityCode = "'5133%'";
            break;
        case "凉山":
            cityCode = "'5134%'";
            break;
        default:
            cityCode = "'5101%'";
    }
    return cityCode;
}
/**
* initQueryLayersArray, 构造查询图层数组
* @para []
* @return [layers], 图层数组
*/
function initQueryLayersArray(sqlParam) {
    var layers = [];
    layers.push(initFilterParameter('高等院校P@sichuan', sqlParam));
    layers.push(initFilterParameter('保险公司P@sichuan', sqlParam));
    layers.push(initFilterParameter('餐饮服务P@sichuan', sqlParam));
    layers.push(initFilterParameter('道路附属设施P@sichuan', sqlParam));
    layers.push(initFilterParameter('地区市政府P@sichuan', sqlParam));
    layers.push(initFilterParameter('动物医疗场所P@sichuan', sqlParam));
    layers.push(initFilterParameter('飞机场P@sichuan', sqlParam));
    layers.push(initFilterParameter('风景名胜P@sichuan', sqlParam));
    layers.push(initFilterParameter('公共设施P@sichuan', sqlParam));
    layers.push(initFilterParameter('公检法机关P@sichuan', sqlParam));
    layers.push(initFilterParameter('公司企业P@sichuan', sqlParam));
    layers.push(initFilterParameter('购物服务P@sichuan', sqlParam));
    layers.push(initFilterParameter('火车站P@sichuan', sqlParam));
    layers.push(initFilterParameter('交通地名P@sichuan', sqlParam));
    layers.push(initFilterParameter('交通设施服务P@sichuan', sqlParam));
    layers.push(initFilterParameter('金融保险机构P@sichuan', sqlParam));
    layers.push(initFilterParameter('科教文化服务P@sichuan', sqlParam));
    layers.push(initFilterParameter('摩托车服务P@sichuan', sqlParam));
    layers.push(initFilterParameter('汽车服务P@sichuan', sqlParam));
    layers.push(initFilterParameter('汽车维修P@sichuan', sqlParam));
    layers.push(initFilterParameter('汽车销售P@sichuan', sqlParam));
    layers.push(initFilterParameter('桥P@sichuan', sqlParam));
    layers.push(initFilterParameter('区县级政府P@sichuan', sqlParam));
    layers.push(initFilterParameter('商务住宅P@sichuan', sqlParam));
    layers.push(initFilterParameter('生活服务P@sichuan', sqlParam));
    layers.push(initFilterParameter('省级政府P@sichuan', sqlParam));
    layers.push(initFilterParameter('体育休闲服务P@sichuan', sqlParam));
    layers.push(initFilterParameter('小学及幼儿园P@sichuan', sqlParam));
    layers.push(initFilterParameter('写字楼P@sichuan', sqlParam));
    layers.push(initFilterParameter('行政地名P@sichuan', sqlParam));
    layers.push(initFilterParameter('医疗保健服务P@sichuan', sqlParam));
    layers.push(initFilterParameter('银行P@sichuan', sqlParam));
    layers.push(initFilterParameter('银行相关P@sichuan', sqlParam));
    layers.push(initFilterParameter('证券公司P@sichuan', sqlParam));
    layers.push(initFilterParameter('政府机关及社会团体P@sichuan', sqlParam));
    layers.push(initFilterParameter('中学P@sichuan', sqlParam));
    layers.push(initFilterParameter('住宿服务P@sichuan', sqlParam));
    layers.push(initFilterParameter('专科医院P@sichuan', sqlParam));
    layers.push(initFilterParameter('自动取款机P@sichuan', sqlParam));
    layers.push(initFilterParameter('自然地名P@sichuan', sqlParam));
    layers.push(initFilterParameter('指挥所P@sichuan', sqlParam));
    layers.push(initFilterParameter('人防工程P@sichuan', sqlParam));
    layers.push(initFilterParameter('重点防护目标P@sichuan', sqlParam));
    layers.push(initFilterParameter('综合医院P@sichuan', sqlParam));
    return layers;
}
/**
* initFilterParameter, 构造REST查询参数
* @para [layerName, attributeFilter], 图层名,SQL查询参数
* @return [filterParameter] , SuperMap.REST.FilterParameter
*/
function initFilterParameter(layerName, attributeFilter) {
    var filterParameter = new SuperMap.REST.FilterParameter(
        {
            name: layerName,
            attributeFilter: attributeFilter
        }
    );
    return filterParameter;
}
/**
* sqlQueryCompleted, REST查询成功, 结果处理
* @para [SuperMap.REST.QueryEventArgs], 查询结果数据
* @return []
*/
function sqlQueryCompleted(queryEventArgs) {
    /*通信回执, 查询成功*/
    $('#communicationReceiptPanel-innerCt').empty();
    $('#communicationReceiptPanel-innerCt').append('查询成功 !');
    /*显示查询结果列表*/ 
    showQueryResultList(queryEventArgs);
}
/**
* showQueryResultList, 表格形式显示查询结果列表
* @para [SuperMap.REST.QueryEventArgs], 查询结果数据
* @return []
*/
function showQueryResultList(queryEventArgs) {
    var resultList = '';
    resultList += "<table class='queryResultList'><thead><th>ID</th><th>地点名称</th><thead><tbody>";
    var result = queryEventArgs.result;
    var recordsets = result.recordsets;
    var recordsetsLen = recordsets.length;
    for (var i = 0; i < recordsetsLen; i++) {
        var datasetName = recordsets[i].datasetName;
        var features = recordsets[i].features;
        var featuresLen = features.length;
        if (!datasetName || !features) return;
        for (var k = 0; k < featuresLen; k++) {
            var feature = features[k];
            var ID = k + 1;
            resultList += "<tr onclick='addBackgroundColor(this)'>";;
            resultList += "<td>" + ID + "</td>";
            resultList += "<td onclick=\"" + "resultListClickHandler(" + "'" + datasetName + "','" + feature.geometry + "','" + feature.geometry.x + "','" + feature.geometry.y + "','" + feature.attributes.Name + "','" + feature.attributes.Code + "'" + ")\">" + feature.attributes.Name + "</td></tr>";
        }
    }
    resultList += "</tbody></table>";
    $('#queryResultsPanel-innerCt').empty();
    $('#queryResultsPanel-innerCt').append(resultList);
}
/**
* addBackgroundColor, 添加背景颜色
* @para []
* @return []
*/
function addBackgroundColor(tableRows) {
    var clickedTableRows = document.querySelectorAll(".tableRowsClicked");
    var len = clickedTableRows.length;
    for (var i = 0; i < len; i++) {
        clickedTableRows[i].classList.remove("tableRowsClicked");
    }
    tableRows.classList.add("tableRowsClicked");
}
/**
* resultListClickHandler, 结果列表单击事件, 地图定位, 保存定位点参数
* @para []
* @return []
*/
function resultListClickHandler(datasetName, geometry, x, y, attibutesName, attributesCode) {
    $('#communicationReceiptPanel-innerCt').empty();
    /*保存事发地点相关信息*/
    setIncidentSiteParam(datasetName, geometry, x, y, attibutesName, attributesCode);
    /*定位到事发地点*/
    locateIncidentSite(x, y);
}
/**
* 设置事发地点参数
* 包括: 事发点图层名, 位置信息, 地址名, 地址编码等
* @para [layerName, geometry, placeName, placeCode]
* @return []
*/
function setIncidentSiteParam(datasetName, geometry, x, y, attibutesName, attributesCode) {
    site.layerName = datasetName;
    site.geometry = geometry;
    site.placeName = attibutesName;
    site.placeCode = attributesCode;
    site.lon = x;
    site.lat = y;
}
/**
* locateIncidentSite, 定位到事发点
* @para []
* @return []
*/
function locateIncidentSite(x, y) {
    /*指定地图中心点为定位点, 放大地图*/
    map.setCenter(new SuperMap.LonLat(x, y), 0);
    map.zoomTo(15);
    /*添加定位标记*/
    var anchorPoint = initMarker(new SuperMap.Size(21, 25), "./images/anchorPoint.png", x, y);
    markerLayer.clearMarkers();
    markerLayer.addMarker(anchorPoint);
    icon.centerMarker = anchorPoint;
}
/**
* sqlQueryFailed, SQL参数的REST查询失败
* @para [error], 失败信息
* @return []
*/
function sqlQueryFailed(e) {
    $("#communicationReceiptPanel-innerCt").empty();
    $("#communicationReceiptPanel-innerCt").append("查询失败!" + '</br>' + e.error.errorMsg);
}
/**
* bufferAnalysisByRadius, 通过输入缓冲区分析半径值进行缓冲区分析
* @para []
* @return [Boolean], 是否已进行缓冲区分析
*/
function bufferAnalysis() {
    /*缓冲区分析地点和半径不能为空*/
    if (!site.placeName) {
        Ext.MessageBox.alert('系统提示', '请选择缓冲区分析地点 !');
        return false;
    }
    var radius = $('#bufferAnalysisTextField-inputEl').val();
    if (!radius) {
        Ext.MessageBox.alert('系统提示', '请输入缓冲区分析半径 !');
        return false;
    }
    var regExp = /^(([0-9]+[\.]?[0-9]+)|[1-9])$/;
    var isPositiveInteger = regExp.test(radius);
    if (!isPositiveInteger) {
        Ext.MessageBox.alert('系统提示', '缓冲区分析半径必须是正数 !');
        return false;
    }
    /*清楚缓存*/
    if (car.removeLayer) {
        map.removeLayer(animatorCarsLayer);
        car.removeLayer = false;
    }
    bufferAnalysisLayer.removeAllFeatures();
    bufferAnalysisMarkerLayer.clearMarkers();
    pathLayer.removeAllFeatures();
    bufferAnalysisArray = [];
    map.removeAllPopup();
    car.oldCar = null;
    /*重新定位当前地图, 这样有一个交互的效果*/
    locateIncidentSite(site.lon, site.lat);
    /**
    * 不论缓冲区分析成功与否, 先放大地图并画出缓冲区, 讲道理应该等分析成功才处理的, 但是这里为了避免缓冲区分析时的卡顿, 直接画圆
    */
    var param = initBufferAnalysisParam(radius);
    if (!param) return false;
    /*放大地图以适应缓冲区*/
    var checkZoomRadius = zoomMapByRadius(param.mapZoomRadius);
    if (!checkZoomRadius)  {
        bufferAnalysisLayer.removeAllFeatures();
        return false;
    }
    /*缓冲区分析画圆*/
    drawBufferAnalysisCircular(param.analysisRadius);
    /*缓冲区查询*/
    bufferQuery(param);
    return true;
};
/**
* initBufferAnalysisParam, 构造缓冲区分析参数, 包括: 单位, 半径
* @para []
* @return [parameter] 返回缓冲区分析参数
*/
function initBufferAnalysisParam(radius) {
    var unit = $('#bufferAnalysisCombo-inputEl').val();
    var radius = radius;
    var param = new Object();
    param.analysisRadius = '';
    param.mapZoomRadius = '';
    (unit === '米') ? (param.analysisRadius = radius * 0.0000083333333) : (param.analysisRadius = radius * 0.0083333333);
    (unit === '米') ? (param.mapZoomRadius = radius * 0.001) : (param.mapZoomRadius = radius);
    param.layers = initAnalysisLayer();
    param.geometry = new SuperMap.Geometry.Point(site.lon, site.lat);
    return param;
}
/**
* getParamByLayerName, 根据图层名构造REST图层查询参数
* @para []
* @return []
*/
function getParamByLayerName(layerName) {
    return new SuperMap.REST.FilterParameter(
        {
            name: layerName
        }
    );
}
/**
* initAnalysisLayer, 构造缓冲区分析图层
* @para []
* @return [Array], 缓冲区分析图层数组
*/
function initAnalysisLayer() {
    var analysisLayer = new Array();
    analysisLayer.push(getParamByLayerName("省级政府P@sichuan"));
    analysisLayer.push(getParamByLayerName("地区市政府P@sichuan"));
    analysisLayer.push(getParamByLayerName("区县级政府P@sichuan"));
    analysisLayer.push(getParamByLayerName("政府机关及社会团体P@sichuan"));
    analysisLayer.push(getParamByLayerName("公检法机关P@sichuan"));
    analysisLayer.push(getParamByLayerName("医疗保健服务P@sichuan"));
    analysisLayer.push(getParamByLayerName("综合医院P@sichuan"));
    analysisLayer.push(getParamByLayerName("专科医院P@sichuan"));
    analysisLayer.push(getParamByLayerName("动物医疗场所P@sichuan"));
    analysisLayer.push(getParamByLayerName("高等院校P@sichuan"));
    analysisLayer.push(getParamByLayerName("中学P@sichuan"));
    analysisLayer.push(getParamByLayerName("小学及幼儿园P@sichuan"));
    analysisLayer.push(getParamByLayerName("天网@sichuan"));
    return analysisLayer;
}
/**
* bufferQuery, 缓冲区查询分析
* @para []
* @return []
*/
function bufferQuery(param) {
    var parameters = new SuperMap.REST.QueryByDistanceParameters({
        queryParams: param.layers,
        returnContent: true,
        distance: param.analysisRadius,
        expectCount: 10000,
        geometry: param.geometry
    });
    var service = new SuperMap.REST.QueryByDistanceService(url);
    service.events.on({
        "processCompleted": bufferAnalysisprocessCompleted,
        "processFailed": bufferAnalysisprocessFailed
    });
    service.processAsync(parameters);
}
/**
* bufferAnalysisprocessCompleted, 缓冲区分析成功
* @para [queryEventArgs], 缓冲区分析结果数据
* @return []
*/
function bufferAnalysisprocessCompleted(queryEventArgs) {
    $('#communicationReceiptPanel-innerCt').empty();
    $('#communicationReceiptPanel-innerCt').append("缓冲区分析成功 !");
    /*缓冲区分析结果处理*/
    bufferAnalysisResultHandling(queryEventArgs);
    /*显示缓冲区分析结果*/
    showBufferAnalysisResultList();
};
/**
* zoomMapByRadius, 放大地图到指定级别以适应缓冲区
* @para [mapZoomRadius], 地图放大半径参数, 通过该参数可以确定地图的放大级别
* @return []
*/
function zoomMapByRadius(mapZoomRadius) {
    if (!mapZoomRadius) return;
    if (mapZoomRadius <= 0.1) {
        map.zoomTo(19);
    } else {
        if (mapZoomRadius <= 0.4 && mapZoomRadius > 0.1) {
            map.zoomTo(18);
        } else {
            if (mapZoomRadius <= 0.7 && mapZoomRadius > 0.4) {
               map.zoomTo(16);
            } else {
                if(mapZoomRadius <= 0.8 && mapZoomRadius > 0.7) {
                     map.zoomTo(15);
                } else {
                    if (mapZoomRadius <= 1 && mapZoomRadius > 0.8) {
                        map.zoomTo(14);
                    } else {
                        if (mapZoomRadius <= 3 && mapZoomRadius > 1) {
                            map.zoomTo(9);
                        } else {
                            if (mapZoomRadius <= 5 && mapZoomRadius > 3) {
                                map.zoomTo(5);
                            } else {
                                if (mapZoomRadius <= 10 && mapZoomRadius > 5) {
                                    map.zoomTo(2);
                                } else {
                                    Ext.MessageBox.alert('系统提示', '缓冲区分析半径不能大于10公里 !');
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}
/**
* drawBufferAnalysisCircular, 缓冲区分析画圆
* @para []
* @return []
*/
function drawBufferAnalysisCircular(radius) {
    if (!radius) return;
    bufferAnalysisLayer.removeAllFeatures();
    if (!site.lon || !site.lat) return;
    var circularCenter = new SuperMap.Geometry.Point(site.lon, site.lat); 
    var circularRadius = new SuperMap.Geometry.Polygon.createRegularPolygon(circularCenter, radius, 100, 360); 
    var circular = new SuperMap.Feature.Vector();
    circular.geometry = circularRadius;
    circular.style = {
        strokeColor: "red",
        strokeWidth: 2,
        pointerEvents: "visiblePainted",
        fill: false
    };
    bufferAnalysisLayer.addFeatures(circular);
}
/**
* bufferAnalysisResultHandling, 缓冲区结果处理
* @para [queryEventArgs], 缓冲区分析结果数据
* @return []
*/
function bufferAnalysisResultHandling(queryEventArgs) {
    /**
    * 缓冲区分析结果对象
    * 包含四个属性值: layerName, geometry, placeName, distance
    */
    var result = queryEventArgs.result;
    var recordsetsLen = result.recordsets.length;
    if (!result || !recordsetsLen) return;
    for (var i = 0; i < recordsetsLen; i++) {
        var recordsets = result.recordsets[i];
        var datasetName = recordsets.datasetName;
        var features = recordsets.features;
        var featuresLen = features.length;
        for (var k = 0; k < featuresLen; k++) {
            var feature = features[k];
            var lon = feature.geometry.x;
            var lat = feature.geometry.y;
            var placeName = feature.attributes.Name;
            if (!lon || !lat || !placeName) return;
            if (placeName == site.placeName) continue;
            /*保存分析结果数据*/
            var analysisResult = new Object();
            analysisResult.geometry = feature.geometry;
            analysisResult.placeName = placeName;
            analysisResult.distance = measureDistanceApartSite(lon, lat);
            /*显示缓冲区分析结果标绘*/
            showBufferAnalysisResultMarker(analysisResult, datasetName);
        }
    }
    /*缓冲区分析结果排序*/
    quickSortAnalysisResult(bufferAnalysisArray, 0, bufferAnalysisArray.length - 1);
    /*显示缓冲区分析结果列表*/
    showBufferAnalysisResultList();
}
/**
* showBufferAnalysisResultMarker, 显示缓冲区分析结果标绘
* @para [analysisResult], 缓冲区分析结果数据
* @return [sortResult], 排序地点数组
*/
function showBufferAnalysisResultMarker(analysisResult, datasetName) {
    var lon = analysisResult.geometry.x;
    var lat = analysisResult.geometry.y;
    var layerName = datasetName;
    if (layerName == '政府部门@四川省' || layerName == '地区市政府P@sichuan' || layerName == '政府机关及社会团体P@sichuan' || layerName == '区县级政府P@sichuan') {
        var checked = Ext.getCmp('governmentSectorCheckBox').getValue();
        if (checked) {
            addResultMarker(new SuperMap.Size(21, 25), './images/government.png', lon, lat, analysisResult.placeName);
            bufferAnalysisArray.push(analysisResult);
        }
    } else {
        if (layerName == '公检法机关P@sichuan') {
            var checked = Ext.getCmp('judicialDepartmentsCheckBox').getValue();
            if (checked) {
                addResultMarker(new SuperMap.Size(32, 32), './images/policefire.png', lon, lat, analysisResult.placeName);
                bufferAnalysisArray.push(analysisResult);
            }
        } else {
            if (layerName == '医疗保健服务P@sichuan' || layerName == '综合医院P@sichuan' || layerName == '专科医院P@sichuan' || layerName == '动物医疗场所P@sichuan') {
                var checked = Ext.getCmp('hospitalCheckBox').getValue();
                if (checked) {
                    addResultMarker(new SuperMap.Size(32, 32), './images/hospital.png', lon, lat, analysisResult.placeName); 
                    bufferAnalysisArray.push(analysisResult);
                }
            } else {
                if (layerName == '高等院校P@sichuan' || layerName == '中学P@sichuan' || layerName == '小学及幼儿园P@sichuan') {
                    var checked = Ext.getCmp('schoolCheckBox').getValue();
                    if (checked) {
                        addResultMarker(new SuperMap.Size(28, 28), './images/school.png', lon, lat, analysisResult.placeName);
                        bufferAnalysisArray.push(analysisResult);
                    }
                } else {
                    if (layerName == '天网@sichuan') {
                        var checked = Ext.getCmp('skynetCheckBox').getValue();
                        if (checked) {
                            addResultMarker(new SuperMap.Size(24,24), './images/skynet.png', lon, lat, analysisResult.placeName, true);
                        }
                    } else {
                        return;
                    }
                }
            }
        }
    }
}
/**
* addResultMarker, 添加缓冲区分析结果标绘
* @para []
* @return []
*/
function addResultMarker(size, src, lon, lat, placeName, hasVideo) {
    var marker = initMarker(size, src, lon, lat);
    bufferAnalysisMarkerLayer.addMarker(marker);
    marker.placeName = placeName;
    marker.hasVideo = hasVideo;
    marker.events.on(
        {
            'click' : bufferAnalysisMarkerClickHandler,
              scope : marker
        }
    );
}
/**
* bufferAnalysisMarkerClickHandler, 缓冲区分析标绘单击事件
* @para []
* @return []
*/
function bufferAnalysisMarkerClickHandler() {
    var hasVideo = this.hasVideo;
    var placeName = this.placeName;
    closeMapPopups();
    if (hasVideo) {
        addMarkerVideoPopup();
    } else {
        if (!placeName) return;
        addMarkerInfoPopup(placeName);
    }
}
/**
* addMarkerVideoPopup, 缓冲区分析标绘视频窗口
* @para []
* @return []
*/
function addMarkerVideoPopup() {
    /*拿到视频地址*/
    var src = randomVideo().src;
    if (!src) return;
    var contentHtml = '<video id="markerVideoPopup" autoplay="autoplay" controls><source src="' +  src + '"/></video>';
    /*构造视频窗口, 添加到map*/
    var markerVideoPopup = new SuperMap.Popup('markerVideoPopup', mouse.lonlat(6), new SuperMap.Size(300, 200), contentHtml);
    /*移动地图确保弹窗在视图窗口内*/
    markerVideoPopup.panMapIfOutOfView = true;
    markerVideoPopup.maxSize = new SuperMap.Size(300, 200);
    map.addPopup(markerVideoPopup);
}
/**
* randomVideo, 随机视频
* @para []
* @return []
*/
function randomVideo() {
    var random = Math.round(Math.random()*1 + 1);
    var video = new Object();
    video.src = null;
    switch (random) {
        case 1 :
        video.src = './source/videos/skynetVideo/day.webm';
        break;
        case 2 :
        video.src = './source/videos/skynetVideo/night.webm';
        break;
        default : 
        video.src = '';
    }
    return video;
}
/**
* addMarkerInfoPopup, 缓冲区分析标绘信息窗口
* @para []
* @return []
*/
function addMarkerInfoPopup(placeName, lon, lat) {
    var lonlat = mouse.lonlat(6);
    if (lon && lat) lonlat = new SuperMap.LonLat(lon, lat);
    var contentHtml = '<div id="placeInfoDiv">' + placeName + '</div>';
    var placeInfoPopup = new SuperMap.Popup.FramedCloud('placeInfoPopup', lonlat, null, contentHtml, null, true, null, true);
    closeMapPopups();
    map.addPopup(placeInfoPopup);
}
/**
* measureDistanceApartSite, 测量当前坐标点距定位点的距离
* @para [lon, lat], 当前坐标的经度和纬度值: SuperMap.LonLat.lon , SuperMap.LonLat.lat
* @return [String], 返回距离值
*/
function measureDistanceApartSite(lon, lat) {
    var incidentSite = new SuperMap.Geometry.Point(site.lon, site.lat);
    var currentSite  = new SuperMap.Geometry.Point(lon, lat);
    var distance = parseInt(currentSite.distanceTo(incidentSite) * 3600 * 33);
    return distance;
}
/**
* quickSortAnalysisResult, 缓冲区分析结果排序
* @para [sortResult], 待排序的数组
* @return []
*/    
function quickSortAnalysisResult(array, min, max) {
    if (min >= max) return;
    var i = min;
    var j = max;
    var key = (array[min].distance + array[min + 1].distance) / 2;
    var iIndex = i, jIndex = j;
    while (1){
        if (i == j) break;
        for (;; --j) {
            if (array[j].distance < key) {
                iIndex = j;
                break;
            }
            if (i == j) break;
        }
        for (;; i++) {
            if (array[i].distance >= key) {
                jIndex = i;
                var temp = array[iIndex];
                array[iIndex] = array[jIndex];
                array[jIndex] = temp;
                break;
            }
            if (i == j) break;
        }
    }
    bufferAnalysisArray = array;
    quickSortAnalysisResult(bufferAnalysisArray, min, i);
    quickSortAnalysisResult(bufferAnalysisArray, i+1, max);
}
/**
* showBufferAnalysisResult, 显示缓冲区分析结果列表
* @para [sortResult], 已排序的结果数组
* @return []
*/
function showBufferAnalysisResultList() {
    $('#queryResultsPanel-innerCt').empty();
    var len = bufferAnalysisArray.length;
    if (!len) return;
    var resultList = '<table class="bufferAnalysisResultList"><thead><th>ID</th><th>距离(m)</th><th>地点名称</th></thead><tbody>';
    for (var i = 0; i < len; i++) {
        var ID = i + 1;
        var distance = bufferAnalysisArray[i].distance;
        var placeName = bufferAnalysisArray[i].placeName;
        var lon = bufferAnalysisArray[i].geometry.x;
        var lat = bufferAnalysisArray[i].geometry.y;
        resultList += '<tr onclick="addBackgroundColor(this)">';
        resultList += "<td>" + ID + "</td><td>" + distance + "</td>";
        resultList += "<td onclick=\"" + "addMarkerInfoPopup('" + placeName + "','" + lon + "','" + lat + "')\">" + placeName + "</td></tr>";
    }
    resultList += '</tbody></table>';
    $('#queryResultsPanel-innerCt').append(resultList);
}
/**
* bufferAnalysisprocessFailed, 缓冲区分析失败
* @para []
* @return []
*/
function bufferAnalysisprocessFailed(e) {
    $('#communicationReceiptPanel-innerCt').empty();
    $('#communicationReceiptPanel-innerCt').append('缓冲区分析失败 !' + '</br>' + e.error.errorMsg);
};
/**
* serviceControl, 勤务管控
* @para []
* @return []
*/
function serviceControl() {
    var fixedDutyPoint = Ext.getCmp('fixedDutyPointCheckBox').getValue();
    var queryDutyArea = Ext.getCmp('queryDutyAreaCheckBox').getValue();
    var dutyVideo = Ext.getCmp('dutyVideoCheckBox').getValue();
    if (!bufferAnalysis()) {
        Ext.MessageBox.alert('系统提示', '请先进行缓冲区分析 !');
        return;
    }
    /*清除缓存*/
    polygonLayer.removeAllFeatures();
    if (fixedDutyPoint) {
        addFixedDutyPointMarker('./images/fixedDutyPoint.png');
    }
    if (fixedDutyPoint && queryDutyArea) {
        addDutyArea();
    }
    if (fixedDutyPoint && dutyVideo) {
        bufferAnalysisMarkerLayer.clearMarkers();
        addFixedDutyPointMarker('./images/jksp.png');
    }
}
/**
* addFixedDutyPoint, 添加固定执勤点标绘
* @para []
* @return []
*/
function addFixedDutyPointMarker(src) {
    var fixedDutyPointArray = [
        new SuperMap.Geometry.Point(104.07760, 30.65640),
        new SuperMap.Geometry.Point(104.06532,30.65738),
        new SuperMap.Geometry.Point(104.07527,30.67079),
        new SuperMap.Geometry.Point(103.95837, 30.57890),
        new SuperMap.Geometry.Point(104.06575, 30.56841),
        new SuperMap.Geometry.Point(104.08067, 30.69574),
        new SuperMap.Geometry.Point(104.14379, 30.62745),
        new SuperMap.Geometry.Point(104.06499, 30.60606),
        new SuperMap.Geometry.Point(104.07587, 30.65092)
    ];
    var len = fixedDutyPointArray.length;
    for (var i = 0; i < len; i++) {
        var lon = fixedDutyPointArray[i].x;
        var lat = fixedDutyPointArray[i].y;
        var fixedDutyPointMarker = initMarker(new SuperMap.Size(32, 32), src, lon, lat);
        bufferAnalysisMarkerLayer.addMarker(fixedDutyPointMarker);
        fixedDutyPointMarker.video = false;
        if (src == './images/jksp.png') fixedDutyPointMarker.video = true;
        fixedDutyPointMarker.events.on(
            {
                'click': showFixedDutyPointInfo,
                  scope: fixedDutyPointMarker
            }
        );
    }
}
/**
* showFixedDutyPointInfo, 显示固定执勤点信息
* @para []
* @return []
*/
function showFixedDutyPointInfo() {
    var showVideo = this.video;
    if (showVideo) {
        addDutyVideo();
        return;
    }
    var contentHtml = '<div id="fixedDutyPointInfo"><table><tbody>';
    contentHtml += '<tr><th id="pointInfoHead" colspan="2">执勤点信息</th></tr>';
    contentHtml += '<tr><td>执勤中队:</td><td>' + randomInfo().squadron + '</td></tr>';
    contentHtml += '<tr><td>执勤兵力:</td><td>' + randomInfo().troops   + '</td></tr>';
    contentHtml += '<tr><td>队长电话:</td><td>' + randomInfo().phone    + '</td></tr>';
    contentHtml += '<tr><td id="msgBtn"><input type="button" value="发短信" /></td>';
    contentHtml += '<td id="phoneBtn"><input type="button" value="打电话" /></td></tr>';
    contentHtml += '</tbody></table></div>';
    closeMapPopups();
    var fixedDutyPointPopup = new SuperMap.Popup.FramedCloud('fixedDutyPointPopup', mouse.lonlat(6), new SuperMap.Size(200, 150), contentHtml);
    fixedDutyPointPopup.autoSize = false;
    map.addPopup(fixedDutyPointPopup);
}
/**
* randomInfo, 随机信息
* @para []
* @return []
*/
function randomInfo() {
    var randomInfo = new Object();
    randomInfo.phone = "1";
    randomInfo.squadron = "";
    randomInfo.troops = Math.floor(Math.random()*(150-50+1)+50) + "人";
    var random = Math.floor(Math.random()*(4-1+1)+1);
    switch(random) {
        case 1:
            randomInfo.phone += "3";
            randomInfo.squadron += "一中队";
            break;
        case 2:
            randomInfo.phone += "5";
            randomInfo.squadron += "二中队";
            break;
        case 3:
            randomInfo.phone += "7";
            randomInfo.squadron += "三中队";
            break;
        default:
            randomInfo.phone += "8";
            randomInfo.squadron += "四中队";
    }
    for (var i = 0; i < 9; i++) {
        var randomNum = Math.floor(Math.random()*(9-0+1)+0);
        randomInfo.phone += randomNum;
    }
    return randomInfo;
}
/**
* addDutyArea, 添加固定执勤点执勤区域
* @para []
* @return []
*/
function addDutyArea() {
    var tianfuSqurePointArray = [
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
    ];
    var chunxiRoadPointArray = [
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
        ];
    var point3 = [
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
        ];
    var point4 = [
        new SuperMap.Geometry.Point(104.07396, 30.66964),
        new SuperMap.Geometry.Point(104.07608, 30.67264),
        new SuperMap.Geometry.Point(104.07791, 30.67174),
        new SuperMap.Geometry.Point(104.07589, 30.66873)
        ];
    var point5 = [
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
    var tianfuSqureVector = initDutyAreaPolygonVector(tianfuSqurePointArray);
    var chunxiRoadVector  = initDutyAreaPolygonVector(chunxiRoadPointArray);
    var point3Vector      = initDutyAreaPolygonVector(point3);
    var point4Vector      = initDutyAreaPolygonVector(point4);
    var point5Vector      = initDutyAreaPolygonVector(point5);
    polygonLayer.addFeatures(
        [
            tianfuSqureVector,
            chunxiRoadVector,
            point3Vector,
            point4Vector,
            point5Vector
        ]
    );
}
/**
* initDutyAreaPolygonVector, 构造执勤区域矢量要素
* @para [Array], 用于构造矢量Vector的点数组
* @return [SuperMap.Feature.Vector]
*/
function initDutyAreaPolygonVector(pointArray) {
    if (!pointArray) return;
    var len = pointArray.length;
    if (!len) return;
    var linearRings = new SuperMap.Geometry.LinearRing(pointArray),
        region = new SuperMap.Geometry.Polygon([linearRings]),
        polygonVector = new SuperMap.Feature.Vector(region);
    polygonVector.style = {
        strokeColor: "gray",
        fillColor: "#FF0000",
        fillOpacity: 0.6
    };
    return polygonVector;
}
/**
* addDutyVideo, 添加固定执勤点视频
* @para []
* @return []
*/
function addDutyVideo() {
    var contentHtml = randomDutyVideo().src;
    if (!contentHtml) return;
    closeMapPopups();
    var dutyVideoPopup = new SuperMap.Popup('markerVideoPopup', mouse.lonlat(6), new SuperMap.Size(300, 200), contentHtml);
    /*移动地图确保弹窗在视图窗口内*/
    dutyVideoPopup.panMapIfOutOfView = true;
    dutyVideoPopup.maxSize = new SuperMap.Size(300, 200);
    map.addPopup(dutyVideoPopup);
}
/**
* addDutyVideo, 添加固定执勤点视频
* @para []
* @return []
*/
function randomDutyVideo() {
    var randomNum = Math.round(Math.random()*2 + 1);
    var video = new Object();
    video.src = null;
    switch (randomNum) {
        case 1 :
        video.src = '<video id="dutyVideoPopup" autoplay="autoplay" src="./source/videos/dutyVideo/duty_1.webm" controls></video>';
        break;
        case 2 :
        video.src = '<video id="dutyVideoPopup" autoplay="autoplay" src="./source/videos/dutyVideo/duty_2.webm" controls></video>';
        break;
        default : 
        video.src = '<video id="dutyVideoPopup" autoplay="autoplay" src="./source/videos/dutyVideo/duty_3.webm" controls></video>';
    }
    return video;
}

/**
* sendBigDipperMsg, 发送北斗报文
* @para []
* @return []
*/
function sendBigDipperMsg() {
    var msgPanel = $('#communicationReceiptPanel-innerCt');
    msgPanel.empty();
    var message = $('#bigDipperMsgTextArea-inputEl').val();
    var squadron = $('#bigDipperMsgCombo-inputEl').val();
    if (!message) {
        msgPanel.append('消息发送失败, 消息不能为空 !');
        return;
    }
    msgPanel.empty();
    msgPanel.append('消息发送成功 ! ' + '</br>');
};
/**
* clearBigDipperMsg, 清空北斗报文
* @para []
* @return []
*/
function clearBigDipperMsg() {
    $('#bigDipperMsgTextArea-inputEl').val('');
};