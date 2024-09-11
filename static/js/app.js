// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var filteredMetadata = metadata.filter(obj => obj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  }).catch(function(error) {
    console.log("Error loading the metadata: " + error)
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    var selectedSample = samples.filter(obj => obj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otuIds = selectedSample.otu_ids;
    var otuLabels = selectedSample.otu_labels;
    var sampleValues = selectedSample.sample_values;

    // Build a Bubble Chart
    var trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    };

    // Render the Bubble Chart
    var data = [trace1];

    var layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" }
    };

    Plotly.newPlot('bubble', data, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var yticks = otuIds.map(otuId => `OTU ${otuId}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var bar_data =[ {
      y: yticks.slice(0,10).reverse(),
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // Render the Bar Chart

    var bar_layout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: "Number of Bacteria" },
      margin: {t:30,l:150}
    };

    Plotly.newPlot('bar', bar_data, bar_layout);

    

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      let dataset = dropdown.append("option").text(names[i]).property("value", names[i]);
    }

    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
  buildCharts(first_sample);
  buildMetadata(first_sample);  
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
