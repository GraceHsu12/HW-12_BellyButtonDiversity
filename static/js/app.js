function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    var url = "/metadata/" + sample;

    d3.json(url).then(function(data){
      console.log(data);
    // Use d3 to select the panel with id of `#sample-metadata`
      var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
      panel.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(data).forEach(function([key, value]) {
        console.log(key + value);
        panel.append("tr").text(key + ": " + value);
      });
    });

  }

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url = "/samples/" + sample;
  d3.json(url).then(function(data){
    console.log(data);
  

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleTrace = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }

    };

    var bubbleData = [bubbleTrace];

    Plotly.newPlot("bubble", bubbleData);


    // @TODO: Build a Pie Chart
    console.log(data.otu_ids.slice(0, 10, 1));
    console.log(data.sample_values.slice(0, 10, 1));
    console.log(data.otu_labels.slice(0, 10, 1));

    var pieTrace = {
      labels: data.otu_ids.slice(0, 10, 1),
      values: data.sample_values.slice(0, 10, 1),
      type: "pie",
      hovertext: data.otu_labels.slice(0, 10, 1)
    };

    var pieData = [pieTrace];
    
    Plotly.newPlot("pie", pieData);

    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
