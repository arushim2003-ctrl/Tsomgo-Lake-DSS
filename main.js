
// MAP
const map = new ol.Map({

    target: 'map',

    view: new ol.View({

        center: ol.proj.fromLonLat([88.76, 27.37]),
        zoom: 13

    })

});


// BASE MAPS

const osm = new ol.layer.Tile({

    source: new ol.source.OSM(),

    visible: true

});

const satellite = new ol.layer.Tile({

    source: new ol.source.XYZ({

        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

    }),

    visible: false

});

const terrain = new ol.layer.Tile({

    source: new ol.source.XYZ({

        url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png'

    }),

    visible: false

});

map.addLayer(osm);
map.addLayer(satellite);
map.addLayer(terrain);

// BASEMAP SWITCHER

document.getElementById("basemapSelect")
.addEventListener("change", function () {

    osm.setVisible(false);
    satellite.setVisible(false);
    terrain.setVisible(false);

    if (this.value === "osm") {

        osm.setVisible(true);

    }

    else if (this.value === "satellite") {

        satellite.setVisible(true);

    }

    else if (this.value === "terrain") {

        terrain.setVisible(true);

    }

});


// LAKE BOUNDARY
const lakeBoundary = new ol.layer.Vector({

    source: new ol.source.Vector({

        url: './data/Tsomgo_Lake_Boundary.geojson',

        format: new ol.format.GeoJSON()

    }),

    style: new ol.style.Style({

        stroke: new ol.style.Stroke({

            color: 'yellow',
            width: 3

        })

    })

});

map.addLayer(lakeBoundary);

// INVISIBLE LAKE CLICK LAYER
const lakeClickLayer = new ol.layer.Vector({

    source: new ol.source.Vector({
        url: './data/Tsomgo_Lake_Boundary.geojson',
        format: new ol.format.GeoJSON()
    }),

    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.01)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(255,255,255,0)'
        })
    })

});

map.addLayer(lakeClickLayer);

// WATERSHED
const watershed = new ol.layer.Vector({

    source: new ol.source.Vector({

        url: './data/Tsomgo_Watershed.geojson',

        format: new ol.format.GeoJSON()

    }),

    visible: false,

    style: new ol.style.Style({

        stroke: new ol.style.Stroke({

            color: 'red',
            width: 2

        })

    })

});

map.addLayer(watershed);


// FIELD SAMPLING POINTS LAYER
var fieldSamplingLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/Tsomgo_Field_Sampling.geojson',
    format: new ol.format.GeoJSON()
  }),

  visible: false,

  style: function(feature) {

      return new ol.style.Style({

          image: new ol.style.Circle({

              radius: 6,

              fill: new ol.style.Fill({
                  color: 'red'
              }),

              stroke: new ol.style.Stroke({
                  color: 'white',
                  width: 2
              })

          }),

          text: new ol.style.Text({

              text: feature.get("Site"),

              offsetY: -15,

              font: "12px Poppins",

              fill: new ol.style.Fill({
                  color: "black"
              }),

              stroke: new ol.style.Stroke({
                  color: "white",
                  width: 3
              })

          })

      });

  }

});

map.addLayer(fieldSamplingLayer);

// ELEVATION ZONES
const elevationZones = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: './data/Tsomgo_Elevation_Zones.geojson',
        format: new ol.format.GeoJSON()
    }),

    visible: false,

    style: function(feature) {
        let elev = Number(feature.get('elevation'));

        let color = 'rgba(34,197,94,0.45)';

        if (elev >= 3500) color = 'rgba(234,179,8,0.45)';
        if (elev >= 4000) color = 'rgba(249,115,22,0.45)';
        if (elev >= 4500) color = 'rgba(120,53,15,0.45)';

        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,255,255,0.5)',
                width: 0.5
            })
        });
    }
});

map.addLayer(elevationZones);


// WATER MASKS
function createWaterLayer(year) {

    return new ol.layer.Vector({

        source: new ol.source.Vector({

            url: `./data/Tsomgo_WaterMask_${year}.geojson`,

            format: new ol.format.GeoJSON()

        }),

        visible: false,

        style: new ol.style.Style({

            fill: new ol.style.Fill({

                color: 'rgba(0,0,255,0.5)'

            }),

            stroke: new ol.style.Stroke({

                color: 'blue',
                width: 1

            })

        })

    });

}

const waterLayers = {

    2017: createWaterLayer(2017),
    2018: createWaterLayer(2018),
    2019: createWaterLayer(2019),
    2020: createWaterLayer(2020),
    2021: createWaterLayer(2021),
    2022: createWaterLayer(2022),
    2023: createWaterLayer(2023),
    2024: createWaterLayer(2024),
    2025: createWaterLayer(2025)

};

for (let year in waterLayers) {

    map.addLayer(waterLayers[year]);

}

// LST CLASS LAYERS
function createLSTLayer(year) {

    return new ol.layer.Vector({

        source: new ol.source.Vector({

            url: `./data/Tsomgo_LST_Class_${year}.geojson`,

            format: new ol.format.GeoJSON()

        }),

        visible: false,

        style: function(feature) {

            let cls = feature.get('lst_class');

            let color = 'blue';

            if (cls === 2) {
                color = 'yellow';
            }

            if (cls === 3) {
                color = 'red';
            }

            return new ol.style.Style({

                fill: new ol.style.Fill({
                    color: color
                }),

                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 0.5
                })

            });

        }

    });

}

const lstLayers = {

    2017: createLSTLayer(2017),
    2018: createLSTLayer(2018),
    2019: createLSTLayer(2019),
    2020: createLSTLayer(2020),
    2021: createLSTLayer(2021),
    2022: createLSTLayer(2022),
    2023: createLSTLayer(2023),
    2024: createLSTLayer(2024),
    2025: createLSTLayer(2025)

};

for (let year in lstLayers) {

    map.addLayer(lstLayers[year]);

}

// TDS PROXY CLASS LAYERS
function createTDSLayer(year) {

    return new ol.layer.Vector({

        source: new ol.source.Vector({

            url: `./data/Tsomgo_NDTI_Class_${year}.geojson`,

            format: new ol.format.GeoJSON()

        }),

        visible: false,

        style: function(feature) {

            let cls = feature.get('class');
            let color = 'rgba(56,189,248,0.65)';

            if (cls === 2 || cls === "2") {
            color = 'rgba(245,158,11,0.65)';
            }

            if (cls === 3 || cls === "3") {
            color = 'rgba(124,45,18,0.65)';
            }

            return new ol.style.Style({

                fill: new ol.style.Fill({
                    color: color
                }),

                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 0.5
                })

            });

        }

    });

}

// NDCI CLASS LAYERS
function createNDCILayer(year) {

    return new ol.layer.Vector({

        source: new ol.source.Vector({
            url: `./data/Tsomgo_NDCI_Class_${year}.geojson`,
            format: new ol.format.GeoJSON()
        }),

        visible: false,

        style: function(feature) {

            let cls = feature.get('class');
            let color = 'rgba(59,130,246,0.65)';

            if (cls === 2 || cls === "2") {
                color = 'rgba(34,197,94,0.65)';
            }

            if (cls === 3 || cls === "3") {
                color = 'rgba(22,101,52,0.75)';
            }

            return new ol.style.Style({
                fill: new ol.style.Fill({ color: color }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 0.5
                })
            });
        }
    });
}

const ndciLayers = {
    2017: createNDCILayer(2017),
    2018: createNDCILayer(2018),
    2019: createNDCILayer(2019),
    2020: createNDCILayer(2020),
    2021: createNDCILayer(2021),
    2022: createNDCILayer(2022),
    2023: createNDCILayer(2023),
    2024: createNDCILayer(2024),
    2025: createNDCILayer(2025)
};

for (let year in ndciLayers) {
    map.addLayer(ndciLayers[year]);
}

const tdsLayers = {

    2017: createTDSLayer(2017),
    2018: createTDSLayer(2018),
    2019: createTDSLayer(2019),
    2020: createTDSLayer(2020),
    2021: createTDSLayer(2021),
    2022: createTDSLayer(2022),
    2023: createTDSLayer(2023),
    2024: createTDSLayer(2024),
    2025: createTDSLayer(2025)

};

for (let year in tdsLayers) {

    map.addLayer(tdsLayers[year]);

}

// AREA VALUES
const lakeAreas = {

    2017: "0.223130909",
    2018: "0.229520076",
    2019: "0.229170968",
    2020: "0.236062681",
    2021: "0.226428416",
    2022: "0.235578433",
    2023: "0.229829763",
    2024: "0.225708952",
    2025: "0.23982645"

};

const lstValues = {
    2017: "5.754",
    2018: "5.478",
    2019: "4.342",
    2020: "6.702",
    2021: "6.793",
    2022: "8.069",
    2023: "9.28",
    2024: "7.847",
    2025: "9.008"
};

const era5Values = {
    2017: "2.359",
    2018: "0.215",
    2019: "1.943",
    2020: "2.533",
    2021: "2.235",
    2022: "2.43",
    2023: "2.167",
    2024: "2.742",
    2025: "2.864"
};

const ndtiValues = {
    2017: -0.451,
    2018: -0.368,
    2019: -0.515,
    2020: -0.529,
    2021: -0.399,
    2022: -0.415,
    2023: -0.511,
    2024: -0.461,
    2025: -0.461
};

const ndciValues = {
    2017: -0.191,
    2018: 0.041,
    2019: -0.226,
    2020: 0.038,
    2021: -0.082,
    2022: 0.034,
    2023: -0.136,
    2024: -0.087,
    2025: -0.023
};

const fieldWaterQualityData = {
    October: {
        "Inlet": { pH: 8.9, EC: 40, TDS: 20 },
        "Point 1": { pH: 8.5, EC: 22, TDS: 11 },
        "Point 2": { pH: 9.0, EC: 20, TDS: 10 },
        "Point 3": { pH: 9.2, EC: 20, TDS: 10 },
        "Outlet": { pH: 8.4, EC: 16, TDS: 8 }
    },

    November: {
        "Inlet": { pH: 7.5, EC: 32, TDS: 16 },
        "Point 1": { pH: 7.8, EC: 36, TDS: 18 },
        "Point 2": { pH: 7.7, EC: 20, TDS: 10 },
        "Point 3": { pH: 7.9, EC: 20, TDS: 10 },
        "Outlet": { pH: 7.6, EC: 24, TDS: 12 }
    },

    December: {
        "Inlet": { pH: 8.6, EC: 20, TDS: 10 },
        "Point 1": { pH: 7.8, EC: 20, TDS: 9 },
        "Point 2": { pH: 8.1, EC: 24, TDS: 12 },
        "Point 3": { pH: 7.9, EC: 20, TDS: 10 },
        "Outlet": { pH: 8.2, EC: 25, TDS: 12 }
    }
};

const fieldMonthlyMean = {
    October: { pH: 8.8, EC: 23.6, TDS: 11.8 },
    November: { pH: 7.7, EC: 26.4, TDS: 13.2 },
    December: { pH: 8.12, EC: 21.8, TDS: 10.6 }
};

document.getElementById("fieldMonthSelect")
.addEventListener("change", function () {

    let selectedMonth = this.value;

    if (!selectedMonth) {
        document.getElementById("fieldSummary").innerHTML =
            "Select a month to view field water quality summary.";
        return;
    }

    let mean = fieldMonthlyMean[selectedMonth];

    document.getElementById("fieldSummary").innerHTML =
        "<b>" + selectedMonth + " 2024 Mean Field Values</b><br>" +
        "Mean pH: " + mean.pH + "<br>" +
        "Mean EC: " + mean.EC + "<br>" +
        "Mean TDS: " + mean.TDS;

        let interpretation = "";

if (selectedMonth === "October") {

    interpretation =
    "<b>Interpretation:</b><br>" +
    "Water exhibits alkaline pH conditions (8.8) with low EC (23.6 µS/cm) and low TDS (11.8 mg/L), indicating fresh water with minimal dissolved mineral content and good water quality.";

}

else if (selectedMonth === "November") {

    interpretation =
    "<b>Interpretation:</b><br>" +
    "A decrease in pH (7.7) and increase in EC (26.4 µS/cm) and TDS (13.2 mg/L) suggests slightly greater dissolved ion concentration, although water quality remains within acceptable limits.";

}

else if (selectedMonth === "December") {

    interpretation =
    "<b>Interpretation:</b><br>" +
    "Moderately alkaline water (pH 8.12) with lower EC (21.8 µS/cm) and TDS (10.6 mg/L) indicates relatively stable and low-mineralized freshwater conditions.";

}

document.getElementById("fieldInterpretation").innerHTML =
    interpretation;
});


// FIELD WATER QUALITY TREND CHART

new Chart(document.getElementById("fieldWaterChart"), {
    type: "line",

    data: {
        labels: ["October", "November", "December"],

        datasets: [
            {
                label: "Mean pH",
                data: [8.8, 7.7, 8.12],
                borderWidth: 3,
                tension: 0.45,
                pointRadius: 5
            },
            {
                label: "Mean EC",
                data: [23.6, 26.4, 21.8],
                borderWidth: 3,
                tension: 0.45,
                pointRadius: 5
            },
            {
                label: "Mean TDS",
                data: [11.8, 13.2, 10.6],
                borderWidth: 3,
                tension: 0.45,
                pointRadius: 5
            }
        ]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                display: true
            }
        },

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Month"
                }
            },

            y: {
                title: {
                    display: true,
                    text: "Mean Field Values"
                }
            }
        }
    }
});

const futureYears = [
    2026, 2027, 2028, 2029, 2030,
    2031, 2032, 2033, 2034, 2035,
    2036, 2037, 2038, 2039, 2040,
    2041, 2042, 2043, 2044, 2045,
    2046, 2047, 2048, 2049, 2050
];

const predictedLakeArea = [
    0.235389, 0.236422, 0.237456, 0.238489, 0.239522,
    0.240556, 0.241589, 0.242622, 0.243656, 0.244689,
    0.245722, 0.246756, 0.247789, 0.248822, 0.249856,
    0.250889, 0.251922, 0.252956, 0.253989, 0.255022,
    0.256056, 0.257089, 0.258122, 0.259156, 0.260189
];

const predictedLST = [
    9.644, 10.167, 10.690, 11.212, 11.735,
    12.258, 12.781, 13.304, 13.826, 14.349,
    14.872, 15.395, 15.917, 16.440, 16.963,
    17.486, 18.008, 18.531, 19.054, 19.577,
    20.100, 20.622, 21.145, 21.668, 22.191
];

const predictedNDTI = [
    -0.473, -0.476, -0.480, -0.483, -0.486,
    -0.490, -0.493, -0.496, -0.499, -0.503,
    -0.506, -0.509, -0.512, -0.516, -0.519,
    -0.522, -0.526, -0.529, -0.532, -0.535,
    -0.539, -0.542, -0.545, -0.549, -0.552
];



// YEAR DROPDOWN
document.getElementById("yearSelect")
.addEventListener("change", function () {

    let selectedYear = this.value;

    for (let year in waterLayers) {

        waterLayers[year].setVisible(false);

    }

    if (selectedYear) {

        waterLayers[selectedYear].setVisible(true);

        if (document.getElementById("lstCheck").checked) {

    lstLayers[selectedYear].setVisible(true);

}

if (document.getElementById("tdsCheck").checked) {

    tdsLayers[selectedYear].setVisible(true);

}

if (document.getElementById("ndciCheck").checked) {
    ndciLayers[selectedYear].setVisible(true);
}

        document.getElementById("areaInfo")
        .innerHTML =
            "Lake Area (" + selectedYear + "): "
            + lakeAreas[selectedYear]
            + " sq. km";
        
        document.getElementById("kpiArea")
        .innerHTML =
        lakeAreas[selectedYear] + " km²";

        document.getElementById("kpiLST")
        .innerHTML =
        lstValues[selectedYear] + " °C";

        document.getElementById("kpiNDTI")
        .innerHTML =
        ndtiValues[selectedYear];

            document.getElementById("lstInfo").innerHTML =
            "Mean Lake LST (" + selectedYear + "): "
            + lstValues[selectedYear]
            + " °C";

            document.getElementById("ndtiInfo").innerHTML =
            "Mean NDTI (" + selectedYear + "): "
            + ndtiValues[selectedYear];

            document.getElementById("ndciInfo").innerHTML =
    "Mean NDCI (" + selectedYear + "): "
    + ndciValues[selectedYear];

    let currentNDCI = Number(ndciValues[selectedYear]);

if (currentNDCI < -0.10) {

    document.getElementById("ndciInterpretation").innerHTML =
    "Low chlorophyll concentration observed in " +
    selectedYear +
    ", indicating oligotrophic conditions and relatively low algal productivity.";

}
else if (currentNDCI < 0.05) {

    document.getElementById("ndciInterpretation").innerHTML =
    "Moderate chlorophyll condition observed in " +
    selectedYear +
    ", indicating stable ecological productivity.";

}
else {

    document.getElementById("ndciInterpretation").innerHTML =
    "Elevated chlorophyll condition observed in " +
    selectedYear +
    ", indicating increased algal productivity and the potential need for closer monitoring.";

}

            let currentNDTI = Number(ndtiValues[selectedYear]);

if (currentNDTI <= -0.1) {
    document.getElementById("ndtiInterpretation").innerHTML =
        "Low NDTI condition observed in " + selectedYear +
        ", indicating relatively clearer water conditions.";
} else if (currentNDTI <= 0.1) {
    document.getElementById("ndtiInterpretation").innerHTML =
        "Moderate NDTI condition observed in " + selectedYear +
        ", indicating moderate turbidity conditions.";
} else {
    document.getElementById("ndtiInterpretation").innerHTML =
        "High NDTI condition observed in " + selectedYear +
        ", indicating higher turbidity or suspended matter conditions.";
}

            let currentLST = Number(lstValues[selectedYear]);

if (currentLST <= 5) {
    document.getElementById("tempInterpretation").innerHTML =
        "The lake shows low surface temperature conditions in " + selectedYear + ".";
} else if (currentLST <= 15) {
    document.getElementById("tempInterpretation").innerHTML =
        "The lake shows moderate surface temperature conditions in " + selectedYear + ".";
} else {
    document.getElementById("tempInterpretation").innerHTML =
        "The lake shows relatively high surface temperature conditions in " + selectedYear + ".";
}

    }
let previousYear = Number(selectedYear) - 1;

if (lakeAreas[previousYear]) {

    let currentArea = Number(lakeAreas[selectedYear]);
    let previousArea = Number(lakeAreas[previousYear]);
    let difference = currentArea - previousArea;

    if (difference > 0) {
        document.getElementById("interpretation").innerHTML =
            "In " + selectedYear + ", the lake area increased by "
            + difference.toFixed(4)
            + " sq. km compared to " + previousYear + ".";
    }

    else if (difference < 0) {
        document.getElementById("interpretation").innerHTML =
            "In " + selectedYear + ", the lake area decreased by "
            + Math.abs(difference).toFixed(4)
            + " sq. km compared to " + previousYear + ".";
    }

    else {
        document.getElementById("interpretation").innerHTML =
            "In " + selectedYear + ", the lake area remained stable compared to "
            + previousYear + ".";
    }

} else {

    document.getElementById("interpretation").innerHTML =
        selectedYear + " is the first year in the dataset, so previous-year comparison is not available.";
}

// AHP-BASED LAKE HEALTH INDEX

let area = Number(lakeAreas[selectedYear]);
let lst = Number(lstValues[selectedYear]);
let ndti = Number(ndtiValues[selectedYear]);
let ndci = Number(ndciValues[selectedYear]);

let areaConditionScore = 0;
let lstConditionScore = 0;
let ndtiConditionScore = 0;
let ndciConditionScore = 0;

// Area condition score
if (area >= 0.225 && area <= 0.240) {
    areaConditionScore = 100;
} else {
    areaConditionScore = 70;
}

// LST condition score
if (lst <= 5) {
    lstConditionScore = 100;
} else if (lst <= 9) {
    lstConditionScore = 75;
} else {
    lstConditionScore = 50;
}

// NDTI condition score
if (ndti <= -0.1) {
    ndtiConditionScore = 100;
} else if (ndti <= 0.1) {
    ndtiConditionScore = 70;
} else {
    ndtiConditionScore = 40;
}

// NDCI condition score
if (ndci < -0.10) {
    ndciConditionScore = 100;
} else if (ndci < 0.05) {
    ndciConditionScore = 75;
} else {
    ndciConditionScore = 50;
}

// AHP-derived weights
let areaWeight = 0.5462;
let lstWeight = 0.2323;
let ndtiWeight = 0.1377;
let ndciWeight = 0.0838;

let totalHealthScore =
    (areaConditionScore * areaWeight) +
    (lstConditionScore * lstWeight) +
    (ndtiConditionScore * ndtiWeight) +
    (ndciConditionScore * ndciWeight);

totalHealthScore = totalHealthScore.toFixed(2);

let healthStatus = "";
let healthColor = "";

if (totalHealthScore >= 80) {
    healthStatus = "Good Condition";
    healthColor = "#16a34a";
} else if (totalHealthScore >= 60) {
    healthStatus = "Moderate Watch";
    healthColor = "#f59e0b";
} else {
    healthStatus = "Environmental Concern";
    healthColor = "#dc2626";
}

document.getElementById("healthScore").innerHTML =
    totalHealthScore + " / 100";

document.getElementById("healthStatus").innerHTML =
    "Status: " + healthStatus;

document.getElementById("healthDetails").innerHTML =
    "<b>AHP-based Lake Health Assessment</b><br>" +
    "Area Score: " + areaConditionScore + " × 0.5462<br>" +
    "LST Score: " + lstConditionScore + " × 0.2323<br>" +
    "NDTI Score: " + ndtiConditionScore + " × 0.1377<br>" +
    "NDCI Score: " + ndciConditionScore + " × 0.0838<br><br>" +
    "Weights derived using AHP; CR = 0.0189.";

document.querySelector(".health-card").style.borderLeftColor =
    healthColor;

    // =========================
// THREAT ASSESSMENT
// =========================

let threatText = "";
let threatStatus = "Threat Status: ";

if (lst > 8) {
    threatText += "🟠 Rising Temperature: Elevated LST indicates thermal stress.<br><br>";
} else {
    threatText += "🟢 Rising Temperature: LST remains within lower to moderate range.<br><br>";
}

if (ndti > -0.10) {
    threatText += "🟠 Turbidity Pressure: Increased suspended matter may affect water clarity.<br><br>";
} else {
    threatText += "🟢 Turbidity Pressure: Low turbidity conditions observed.<br><br>";
}

if (ndci > 0.05) {
    threatText += "🟠 Chlorophyll/Productivity: Higher chlorophyll may indicate algal productivity risk.<br><br>";
} else {
    threatText += "🟢 Chlorophyll/Productivity: Low to moderate productivity conditions observed.<br><br>";
}

threatText += "🟠 Tourism Pressure: High visitor activity may contribute to shoreline disturbance and waste generation.<br><br>";

threatText += "🟠 Climate Change: Continued warming may affect long-term lake stability.";

document.getElementById("threatStatus").innerHTML =
    threatStatus + healthStatus;

document.getElementById("threatDetails").innerHTML =
    threatText;

// ==========================
// MANAGEMENT RECOMMENDATIONS
// ==========================

let recommendationText = "";

if (healthStatus === "Good Condition") {

    recommendationText =
    "• Continue annual Sentinel-2 and Landsat monitoring.<br>" +
    "• Maintain seasonal field sampling for pH, EC and TDS.<br>" +
    "• Strengthen waste collection around tourist zones.<br>" +
    "• Monitor future temperature trends.<br>" +
    "• Preserve natural shoreline conditions.";

}

else if (healthStatus === "Moderate Watch") {

    recommendationText =
    "• Increase water quality monitoring frequency.<br>" +
    "• Investigate potential sediment sources.<br>" +
    "• Enhance tourist waste management measures.<br>" +
    "• Conduct seasonal ecological assessments.<br>" +
    "• Review watershed conservation practices.";

}

else {

    recommendationText =
    "• Initiate detailed environmental assessment.<br>" +
    "• Increase field sampling and laboratory testing.<br>" +
    "• Implement restoration and pollution-control measures.<br>" +
    "• Strengthen visitor regulation and waste management.<br>" +
    "• Develop an early-warning monitoring framework.";

}

document.getElementById("recommendationStatus").innerHTML =
    healthStatus;

document.getElementById("recommendationDetails").innerHTML =
    recommendationText;
});




// CHECK BOX
document.getElementById("boundaryCheck")
.addEventListener("change", function () {

    lakeBoundary.setVisible(this.checked);

});

document.getElementById("watershedCheck")
.addEventListener("change", function () {

    watershed.setVisible(this.checked);

});

document.getElementById("elevationCheck")
.addEventListener("change", function () {
    elevationZones.setVisible(this.checked);
});

document.getElementById("fieldSamplingCheck")
.addEventListener("change", function () {
    fieldSamplingLayer.setVisible(this.checked);
});




// SCALE BAR
const scaleLine = new ol.control.ScaleLine({
    bar: true,
    text: true
});

map.addControl(scaleLine);


// MOUSE COORDINATES
map.on("pointermove", function (evt) {

    const lonLat = ol.proj.toLonLat(evt.coordinate);

    document.getElementById("mouse-position").innerHTML =
        "Lon: " + lonLat[0].toFixed(5) +
        " | Lat: " + lonLat[1].toFixed(5);

});


// AREA TREND GRAPH
const years = Object.keys(lakeAreas);
const areaValues = Object.values(lakeAreas).map(Number);

const ctx = document.getElementById("areaChart");

new Chart(ctx, {
    type: "line",

    data: {
        labels: years,

        datasets: [{
            label: "Lake Area (sq. km)",
            data: areaValues,
            borderColor: "#1f5c66",
            backgroundColor: "rgba(31,92,102,0.15)",
            fill: true,
            borderWidth: 3,
            tension: 0.45,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: "#12343b",
            pointBorderColor: "white",
            pointBorderWidth: 2
        }]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        family: "Poppins",
                        size: 13
                    }
                }
            },

            tooltip: {
                backgroundColor: "#12343b",
                titleFont: {
                    family: "Poppins"
                },
                bodyFont: {
                    family: "Poppins"
                },
                padding: 12,
                cornerRadius: 10
            }
        },

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Year"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            },

            y: {
                title: {
                    display: true,
                    text: "Lake Area sq. km"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            }
        }
    }
});

// SATELLITE IMAGE VIEWER
function updateSatelliteImage() {

    let selectedYear =
        document.getElementById("yearSelect").value;

    let imageType =
        document.getElementById("imageType").value;

    if (selectedYear) {

        let imagePath =
            `./images/${imageType}_${selectedYear}.png`;

        let img =
            document.getElementById("satImage");

        img.src = imagePath;

        img.style.display = "block";
    }
}

document.getElementById("yearSelect")
.addEventListener("change", updateSatelliteImage);

document.getElementById("imageType")
.addEventListener("change", updateSatelliteImage);

// LST CHECKBOX
document.getElementById("lstCheck")
.addEventListener("change", function () {

    for (let year in lstLayers) {

        lstLayers[year].setVisible(false);

    }

    let selectedYear =
        document.getElementById("yearSelect").value;

    if (this.checked && selectedYear) {

        lstLayers[selectedYear].setVisible(true);

    }

});

// TDS CHECKBOX
document.getElementById("tdsCheck")
.addEventListener("change", function () {

    for (let year in tdsLayers) {

        tdsLayers[year].setVisible(false);

    }

    let selectedYear =
        document.getElementById("yearSelect").value;

    if (this.checked && selectedYear) {

        tdsLayers[selectedYear].setVisible(true);

    }

});

// NDCI CHECKBOX
document.getElementById("ndciCheck")
.addEventListener("change", function () {

    for (let year in ndciLayers) {
        ndciLayers[year].setVisible(false);
    }

    let selectedYear =
        document.getElementById("yearSelect").value;

    if (this.checked && selectedYear) {
        ndciLayers[selectedYear].setVisible(true);
    }

});

// LST TIME SERIES GRAPH
const lstYears = Object.keys(lstValues);
const lstChartValues = Object.values(lstValues).map(Number);

new Chart(document.getElementById("lstChart"), {
    type: "line",

    data: {
        labels: lstYears,

        datasets: [{
            label: "Mean Lake LST (°C)",
            data: lstChartValues,
            borderColor: "#d97706",
            backgroundColor: "rgba(217,119,6,0.15)",
            fill: true,
            borderWidth: 3,
            tension: 0.45,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: "#92400e",
            pointBorderColor: "white",
            pointBorderWidth: 2
        }]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        family: "Poppins",
                        size: 13
                    }
                }
            },

            tooltip: {
                backgroundColor: "#12343b",
                titleFont: {
                    family: "Poppins"
                },
                bodyFont: {
                    family: "Poppins"
                },
                padding: 12,
                cornerRadius: 10
            }
        },

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Year"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            },

            y: {
                title: {
                    display: true,
                    text: "Temperature °C"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            }
        }
    }
});
// LANDSAT LST VS ERA5 COMPARISON GRAPH
const era5ChartValues = Object.values(era5Values).map(Number);

new Chart(document.getElementById("era5Chart"), {
    type: "line",

    data: {
        labels: lstYears,

        datasets: [

            {
                label: "Landsat LST (°C)",
                data: lstChartValues,
                borderColor: "#dc2626",
                backgroundColor: "rgba(220,38,38,0.12)",
                fill: false,
                borderWidth: 3,
                tension: 0.45,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: "#991b1b",
                pointBorderColor: "white",
                pointBorderWidth: 2
            },

            {
                label: "ERA5 Temperature (°C)",
                data: era5ChartValues,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,0.12)",
                fill: false,
                borderWidth: 3,
                tension: 0.45,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: "#1d4ed8",
                pointBorderColor: "white",
                pointBorderWidth: 2
            }

        ]
    },

    options: {
        responsive: true,

        plugins: {

            legend: {

                display: true,

                labels: {

                    font: {
                        family: "Poppins",
                        size: 13
                    }

                }

            },

            tooltip: {

                backgroundColor: "#12343b",

                titleFont: {
                    family: "Poppins"
                },

                bodyFont: {
                    family: "Poppins"
                },

                padding: 12,

                cornerRadius: 10

            }

        },

        scales: {

            x: {

                title: {
                    display: true,
                    text: "Year"
                },

                grid: {
                    color: "rgba(0,0,0,0.05)"
                },

                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }

            },

            y: {

                title: {
                    display: true,
                    text: "Temperature °C"
                },

                grid: {
                    color: "rgba(0,0,0,0.05)"
                },

                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }

            }

        }
    }
});

// NDTI TREND GRAPH
const ndtiYears = Object.keys(ndtiValues);
const ndtiChartValues = Object.values(ndtiValues).map(Number);

new Chart(document.getElementById("ndtiChart"), {
    type: "line",

    data: {
        labels: ndtiYears,

        datasets: [{
            label: "Mean NDTI",
            data: ndtiChartValues,
            borderColor: "#7c2d12",
            backgroundColor: "rgba(124,45,18,0.15)",
            fill: true,
            borderWidth: 3,
            tension: 0.45,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: "#92400e",
            pointBorderColor: "white",
            pointBorderWidth: 2
        }]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        family: "Poppins",
                        size: 13
                    }
                }
            },

            tooltip: {
                backgroundColor: "#12343b",
                titleFont: {
                    family: "Poppins"
                },
                bodyFont: {
                    family: "Poppins"
                },
                padding: 12,
                cornerRadius: 10
            }
        },

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Year"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            },

            y: {
                title: {
                    display: true,
                    text: "Mean NDTI"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            }
        }
    }
});

// NDCI TREND GRAPH
const ndciYears = Object.keys(ndciValues);
const ndciChartValues = Object.values(ndciValues).map(Number);

new Chart(document.getElementById("ndciChart"), {
    type: "line",
    data: {
        labels: ndciYears,
        datasets: [{
            label: "Mean NDCI",
            data: ndciChartValues,
            borderColor: "#166534",
            backgroundColor: "rgba(22,101,52,0.15)",
            fill: true,
            borderWidth: 3,
            tension: 0.45,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: "#15803d",
            pointBorderColor: "white",
            pointBorderWidth: 2
        }]
    },
    options: {
        responsive: true
    }
});


// COLLAPSIBLE SECTIONS
document.querySelectorAll(".collapsible").forEach(button => {

    button.addEventListener("click", function () {

        const content = this.nextElementSibling;

        content.classList.toggle("active");

    });

});


// REGRESSION AND PREDICTION CHARTS

const observedLST = Object.values(lstValues).map(Number);
const observedArea = Object.values(lakeAreas).map(Number);
const observedYears = Object.keys(lakeAreas);

const regressionLine = observedLST.map(lst =>
    0.219221 + 0.001565 * lst
);

new Chart(document.getElementById("regressionChart"), {
    type: "scatter",

    data: {
        datasets: [
            {
                label: "Observed Data",
                data: observedLST.map((lst, i) => ({
                    x: lst,
                    y: observedArea[i]
                })),
                backgroundColor: "#12343b",
                borderColor: "white",
                borderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 9
            },
            {
                label: "Regression Line",
                type: "line",
                data: observedLST.map((lst, i) => ({
                    x: lst,
                    y: regressionLine[i]
                })),
                borderColor: "#16a34a",
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.3
            }
        ]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                labels: {
                    font: {
                        family: "Poppins",
                        size: 13
                    }
                }
            },

            tooltip: {
                backgroundColor: "#12343b",
                titleFont: {
                    family: "Poppins"
                },
                bodyFont: {
                    family: "Poppins"
                },
                padding: 12,
                cornerRadius: 10
            }
        },

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Mean Lake LST (°C)"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            },

            y: {
                title: {
                    display: true,
                    text: "Lake Area (sq. km)"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            }
        }
    }
});

new Chart(document.getElementById("areaPredictionChart"), {
    type: "line",

    data: {
        labels: observedYears.concat(futureYears),

        datasets: [
            {
                label: "Observed Lake Area",
                data: observedArea.concat(Array(futureYears.length).fill(null)),
                borderColor: "#1f5c66",
                backgroundColor: "rgba(31,92,102,0.15)",
                borderWidth: 3,
                tension: 0.45,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: "#12343b",
                pointBorderColor: "white",
                pointBorderWidth: 2
            },

            {
                label: "Projected Lake Area",
                data: Array(observedYears.length).fill(null).concat(predictedLakeArea),
                borderColor: "#16a34a",
                backgroundColor: "rgba(22,163,74,0.12)",
                borderWidth: 3,
                borderDash: [6, 6],
                tension: 0.45,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: "#15803d",
                pointBorderColor: "white",
                pointBorderWidth: 2
            }
        ]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                labels: {
                    font: {
                        family: "Poppins",
                        size: 13
                    }
                }
            },

            tooltip: {
                backgroundColor: "#12343b",
                titleFont: {
                    family: "Poppins"
                },
                bodyFont: {
                    family: "Poppins"
                },
                padding: 12,
                cornerRadius: 10
            }
        },

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Year"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            },

            y: {
                title: {
                    display: true,
                    text: "Lake Area (sq. km)"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            }
        }
    }
});

new Chart(document.getElementById("lstPredictionChart"), {
    type: "line",

    data: {
        labels: observedYears.concat(futureYears),

        datasets: [
            {
                label: "Observed LST",
                data: observedLST.concat(Array(futureYears.length).fill(null)),
                borderColor: "#0ea5a4",
                backgroundColor: "rgba(14,165,164,0.15)",
                borderWidth: 3,
                tension: 0.45,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: "#0f766e",
                pointBorderColor: "white",
                pointBorderWidth: 2
            },

            {
                label: "Projected LST",
                data: Array(observedYears.length).fill(null).concat(predictedLST),
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,0.12)",
                borderWidth: 3,
                borderDash: [6, 6],
                tension: 0.45,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBorderColor: "#ccfbf1",
                pointBorderColor: "white",
                pointBorderWidth: 2
            }
        ]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                labels: {
                    font: {
                        family: "Poppins",
                        size: 13
                    }
                }
            },

            tooltip: {
                backgroundColor: "#12343b",
                titleFont: {
                    family: "Poppins"
                },
                bodyFont: {
                    family: "Poppins"
                },
                padding: 12,
                cornerRadius: 10
            }
        },

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Year"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            },

            y: {
                title: {
                    display: true,
                    text: "Mean Lake LST (°C)"
                },
                grid: {
                    color: "rgba(0,0,0,0.05)"
                },
                ticks: {
                    font: {
                        family: "Poppins"
                    }
                }
            }
        }
    }
});

// NDTI PREDICTION GRAPH

const observedNDTI =
Object.values(ndtiValues).map(Number);

new Chart(document.getElementById("ndtiPredictionChart"), {

    type: "line",

    data: {

        labels:
        observedYears.concat(futureYears),

        datasets: [

            {
                label: "Observed NDTI",

                data:
                observedNDTI.concat(
                Array(futureYears.length).fill(null)
                ),

                borderColor: "#7c2d12",

                backgroundColor:
                "rgba(124,45,18,0.12)",

                borderWidth: 3,

                tension: 0.45,

                pointRadius: 5,

                pointHoverRadius: 8,

                pointBackgroundColor: "#92400e",

                pointBorderColor: "white",

                pointBorderWidth: 2
            },

            {
                label: "Projected NDTI",

                data:
                Array(observedYears.length)
                .fill(null)
                .concat(predictedNDTI),

                borderColor: "#f59e0b",

                backgroundColor:
                "rgba(245,158,11,0.12)",

                borderWidth: 3,

                borderDash: [6,6],

                tension: 0.45,

                pointRadius: 4,

                pointHoverRadius: 7,

                pointBackgroundColor: "#d97706",

                pointBorderColor: "white",

                pointBorderWidth: 2
            }

        ]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                labels: {

                    font: {
                        family: "Poppins",
                        size: 13
                    }

                }

            },

            tooltip: {

                backgroundColor: "#12343b",

                titleFont: {
                    family: "Poppins"
                },

                bodyFont: {
                    family: "Poppins"
                },

                padding: 12,

                cornerRadius: 10
            }

        },

        scales: {

            x: {

                title: {
                    display: true,
                    text: "Year"
                }

            },

            y: {

                title: {
                    display: true,
                    text: "Mean NDTI"
                }

            }

        }

    }

});

// MACHINE LEARNING MODEL COMPARISON CHART

fetch("lake_area_lst_model_comparison_chart.csv")
.then(response => response.text())
.then(csvText => {

    const rows = csvText.trim().split("\n").slice(1);

    const lstValuesModel = [];
    const observedAreaModel = [];
    const linearPredModel = [];
    const polynomialPredModel = [];
    const rfPredModel = [];

    rows.forEach(row => {

        const cols = row.split(",");

        lstValuesModel.push(Number(cols[0]));
        observedAreaModel.push(Number(cols[1]));
        linearPredModel.push(Number(cols[2]));
        polynomialPredModel.push(Number(cols[3]));
        rfPredModel.push(Number(cols[4]));

    });

    new Chart(document.getElementById("modelComparisonChart"), {

        type: "line",

        data: {
            labels: lstValuesModel,

            datasets: [
                {
                    label: "Observed Data",
                    data: observedAreaModel,
                    borderColor: "#12343b",
                    backgroundColor: "rgba(18,52,59,0.15)",
                    pointRadius: 4,
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: "Linear Regression",
                    data: linearPredModel,
                    borderColor: "#2563eb",
                    pointRadius: 0,
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: "Polynomial Regression",
                    data: polynomialPredModel,
                    borderColor: "#f59e0b",
                    pointRadius: 0,
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: "Random Forest",
                    data: rfPredModel,
                    borderColor: "#16a34a",
                    pointRadius: 0,
                    borderWidth: 2,
                    tension: 0.2
                }
            ]
        },

        options: {
            responsive: true,
             maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                },

                tooltip: {
                    backgroundColor: "#12343b",
                    padding: 12,
                    cornerRadius: 10
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Mean Lake LST (°C)"
                    }
                },

                y: {
                    title: {
                        display: true,
                        text: "Lake Area (sq. km)"
                    }
                }
            }
        }

    });

});

// RESIZABLE SIDEBAR
const resizeHandle = document.getElementById("resizeHandle");
const gridContainer = document.querySelector(".grid-container");

let isResizing = false;

resizeHandle.addEventListener("mousedown", function () {
    isResizing = true;
    document.body.style.cursor = "ew-resize";
});

document.addEventListener("mousemove", function (e) {
    if (!isResizing) return;

    let sidebarWidth = e.clientX;

    if (sidebarWidth < 280) sidebarWidth = 280;
    if (sidebarWidth > 650) sidebarWidth = 650;

    gridContainer.style.gridTemplateColumns =
        sidebarWidth + "px 8px 1fr";

    map.updateSize();
});

document.addEventListener("mouseup", function () {
    isResizing = false;
    document.body.style.cursor = "default";
});

// LIVE CLIMATE DATA FETCH

document.getElementById("fetchClimateBtn")
.addEventListener("click", function () {

    fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=27.37&longitude=88.76&current=temperature_2m"
    )

    .then(response => response.json())

    .then(data => {

        const temperature =
            data.current.temperature_2m;

        const time =
            data.current.time;

        const formattedTime =
        new Date(time).toLocaleString();

        document.getElementById("liveTemp")
        .innerHTML =
            "Temperature: " + temperature + " °C";

        document.getElementById("liveTime")
        .innerHTML =
        "Last Updated: " + formattedTime;

        if (temperature <= 5) {

            document.getElementById("liveStatus")
            .innerHTML =
                "Status: Cold Himalayan Conditions";

        }

        else if (temperature <= 15) {

            document.getElementById("liveStatus")
            .innerHTML =
                "Status: Moderate Climate Conditions";

        }

        else {

            document.getElementById("liveStatus")
            .innerHTML =
                "Status: Relatively Warm Conditions";

        }

    })

    .catch(error => {

        console.log(error);

        document.getElementById("liveStatus")
        .innerHTML =
            "Status: Unable to fetch climate data.";

    });

});

// LST, NDTI, FIELD SAMPLING AND LAKE BOUNDARY CLICK INFORMATION POPUP

const infoPopup = document.getElementById("infoPopup");

map.on("click", function (evt) {

    let selectedYear = document.getElementById("yearSelect").value;
    let clickedFeature = null;
    let clickedType = null;

    // FIRST PRIORITY: FIELD SAMPLING POINTS
    if (document.getElementById("fieldSamplingCheck").checked) {

        map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {

            if (layer === fieldSamplingLayer) {
                clickedFeature = feature;
                clickedType = "field";
                return true;
            }

        });

    }

    // SECOND PRIORITY: LST CLASS LAYER
    if (!clickedFeature && selectedYear && document.getElementById("lstCheck").checked) {

        map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {

            if (layer === lstLayers[selectedYear]) {
                clickedFeature = feature;
                clickedType = "lst";
                return true;
            }

        });

    }

    // THIRD PRIORITY: NDTI CLASS LAYER
    if (!clickedFeature && selectedYear && document.getElementById("tdsCheck").checked) {

        map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {

            if (layer === tdsLayers[selectedYear]) {
                clickedFeature = feature;
                clickedType = "ndti";
                return true;
            }

        });

    }

    // FOURTH PRIORITY: LAKE CLICK LAYER
    if (!clickedFeature && typeof lakeClickLayer !== "undefined") {

        map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {

            if (layer === lakeClickLayer) {
                clickedFeature = feature;
                clickedType = "lake";
                return true;
            }

        });

    }

    if (clickedFeature) {

        if (clickedType === "field") {

            let selectedMonth = document.getElementById("fieldMonthSelect").value;
            let site = clickedFeature.get("Site");

            if (!selectedMonth) {

                infoPopup.innerHTML =
                    "<b>" + site + "</b><br>" +
                    "Please select a month from Field Water Quality Monitoring.";

            } else {

                let values = fieldWaterQualityData[selectedMonth][site];

                infoPopup.innerHTML =
                    "<b>Field Sampling Location</b><br>" +
                    "Site: " + site + "<br>" +
                    "Month: " + selectedMonth + " 2024<br>" +
                    "pH: " + values.pH + "<br>" +
                    "EC: " + values.EC + "<br>" +
                    "TDS: " + values.TDS;

            }

        }

        else if (clickedType === "lst") {

            let cls = clickedFeature.get("lst_class");
            let className = "";
            let tempRange = "";

            if (cls === 1 || cls === "1") {
                className = "Low Temperature";
                tempRange = "≤ 5°C";
            }

            else if (cls === 2 || cls === "2") {
                className = "Moderate Temperature";
                tempRange = "5°C – 15°C";
            }

            else if (cls === 3 || cls === "3") {
                className = "High Temperature";
                tempRange = "> 15°C";
            }

            infoPopup.innerHTML =
                "<b>LST Classification</b><br>" +
                "Year: " + selectedYear + "<br>" +
                "Class: " + className + "<br>" +
                "Temperature Range: " + tempRange + "<br>" +
                "Mean Lake LST: " + lstValues[selectedYear] + " °C";

        }

        else if (clickedType === "ndti") {

            let cls = clickedFeature.get("class");
            let className = "";
            let condition = "";

            if (cls === 1 || cls === "1") {
                className = "Low NDTI";
                condition = "Relatively clearer water condition";
            }

            else if (cls === 2 || cls === "2") {
                className = "Moderate NDTI";
                condition = "Moderate turbidity condition";
            }

            else if (cls === 3 || cls === "3") {
                className = "High NDTI";
                condition = "Higher turbidity / suspended matter condition";
            }

            infoPopup.innerHTML =
                "<b>NDTI Classification</b><br>" +
                "Year: " + selectedYear + "<br>" +
                "Class: " + className + "<br>" +
                "Condition: " + condition + "<br>" +
                "Mean NDTI: " + ndtiValues[selectedYear];

        }

        else if (clickedType === "lake") {

            infoPopup.innerHTML =
                "<b>Tsomgo Lake</b><br>" +
                "Type: High-altitude glacial lake<br>" +
                "Elevation: ~3753 m<br>" +
                "Location: East Sikkim<br>" +
                "Study Period: 2017–2025<br>" +
                "Parameters: Lake Area, LST, NDTI, NDCI and Field Water Quality";

        }

        infoPopup.style.left = evt.originalEvent.pageX + 12 + "px";
        infoPopup.style.top = evt.originalEvent.pageY + 12 + "px";
        infoPopup.style.display = "block";

    }

    else {
        infoPopup.style.display = "none";
    }

});

document.getElementById("aboutBtn")
.addEventListener("click", function () {

    document.getElementById("aboutModal")
    .style.display = "block";

});

document.getElementById("closeAbout")
.addEventListener("click", function () {

    document.getElementById("aboutModal")
    .style.display = "none";

});

window.addEventListener("click", function(event) {

    let modal =
    document.getElementById("aboutModal");

    if (event.target === modal) {

        modal.style.display = "none";

    }

});

const aboutBtn = document.getElementById("aboutBtn");
const aboutModal = document.getElementById("aboutModal");
const closeAbout = document.getElementById("closeAbout");

aboutBtn.onclick = function () {
    aboutModal.style.display = "block";
};

closeAbout.onclick = function () {
    aboutModal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target === aboutModal) {
        aboutModal.style.display = "none";
    }
};