// FUNCTION #1 of 5: Build Charts
function buildCharts(selectedPatientID) {
    d3.json("samples.json").then(data => {
        console.log(data)
        var selectedPatientData = data.samples.filter(patientData => patientData.id == selectedPatientID)[0]
        var selectedPatientMetaData = data.metadata.filter(patientData => patientData.id == selectedPatientID)[0]
        // Plot Bar Chart
        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        // Use sample_values as the values for the bar chart.
        // Use otu_ids as the labels for the bar chart.
        // Use otu_labels as the hovertext for the chart.
        var trace1 = {
            x: selectedPatientData.sample_values.slice(0,10).reverse(),
            y: selectedPatientData.otu_ids.slice(0,10).map(otu_id=>`OTU #${otu_id}`).reverse(),
            text: selectedPatientData.otu_labels.slice(0,10).reverse(),
            marker: {
                
            },
            type: 'bar',
            orientation:"h"
        };

        var data = [trace1];

        var layout = {
            title: 'Least Used Feature'
        };

        Plotly.newPlot('barGraphDiv', data, layout);

        // Plot Bubble Chart
        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size.
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.
        var trace1 = {
            x: selectedPatientData.otu_ids,
            y: selectedPatientData.sample_values,
            text: selectedPatientData.otu_labels,
            mode: 'markers',
            marker: {
                size: selectedPatientData.sample_values,
                color: selectedPatientData.otu_ids,
                colorscale: "Earth"
            }
        };

        var data = [trace1];

        var layout = {
            title: 'Marker Size',
            showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot('bubbleDiv', data, layout);

        // Plot Gauge
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: selectedPatientMetaData.wfreq,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 400 },
                gauge: { axis: { range: [null, 10] } }
            }
        ];

        var layout = { width: 600, height: 400 };
        Plotly.newPlot('gaugeDiv', data, layout);
    })
};

// FUNCTION #2 of 5: Demographic Info
function populateDemographicInfo(selectedPatientID) {
    var demographicInfoBox = d3.select("#sample-metadata");
    d3.json("samples.json").then((data) => {
      var MetaData = data.metadata;
      var subject = MetaData.filter(
        (sampleobject) => sampleobject.id == selectedPatientID
      )[0];
      var demographicInfoBox = d3.select("#sample-metadata");
      demographicInfoBox.html("");
      Object.entries(subject).forEach(([key, value]) => {
        demographicInfoBox.append("h5").text(`${key}: ${value}`);
      });
    });
  }

// FUNCTION #3 of 5: Option Change
function optionChanged(selectedPatientID) {
    console.log(selectedPatientID);
    buildCharts(selectedPatientID);
    populateDemographicInfo(selectedPatientID);
}

// FUNCTION #4 of 5: Populate Dropdown
function populateDropdown() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var patientIDs = data.names;
        patientIDs.forEach(patientID => {
            dropdown.append("option").text(patientID).property("value", patientID)
        })
    })
}

// FUNCTION #5 of 5: Startup Site Build
function startupSiteBuild() {
    populateDropdown();
    d3.json("samples.json").then(data => {
        buildCharts(data.names[0]);
        populateDemographicInfo(data.names[0]);
    })
};

startupSiteBuild();