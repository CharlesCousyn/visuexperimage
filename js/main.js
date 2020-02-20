let fileJSON;
let loadedConfig;
let myChart;
let nameUsedMetric;

window.addEventListener("load",() =>
{
    document.getElementById('loadFileButton')
        .addEventListener(
        'change',
        evt =>
        {
            let files = evt.target.files;
            let file = files[0];
            let reader = new FileReader();
            reader.onload = event =>
            {
                fileJSON = JSON.parse(event.target.result);

                updateSelects(fileJSON);

                //Listener select criterion
                const selectCriterion = document.getElementById("selectCriterion");
                selectCriterion.addEventListener("change",
                        () =>
                        {
                            loadedConfig = fileJSON.perCriterion.find(critConf => critConf.criterion === selectCriterion.options[selectCriterion.selectedIndex].value).config;
                            nameUsedMetric = fileJSON.metricsNames.find(name => name === selectMetric.options[selectMetric.selectedIndex].value);
                            loadedConfig = updateConfig(loadedConfig, nameUsedMetric);
                            console.log("loadedConfig", loadedConfig);
                            chart(loadedConfig);
                        });

                //Listener select criterion
                const selectConfig = document.getElementById("selectConfig");
                selectConfig.addEventListener("change",
                    () =>
                    {
                        loadedConfig = fileJSON.perCombination.find(combConf => combConf.combination === selectConfig.options[selectConfig.selectedIndex].value).config;
                        nameUsedMetric = fileJSON.metricsNames.find(name => name === selectMetric.options[selectMetric.selectedIndex].value);
                        loadedConfig = updateConfig(loadedConfig, nameUsedMetric);
                        console.log("loadedConfig", loadedConfig);
                        chart(loadedConfig);
                    });

                //Listener select criterion
                const selectMetric = document.getElementById("selectMetric");
                selectMetric.addEventListener("change",
                    () =>
                    {
                        nameUsedMetric = fileJSON.metricsNames.find(name => name === selectMetric.options[selectMetric.selectedIndex].value);
                        if(loadedConfig !== undefined)
                        {
                            loadedConfig = updateConfig(loadedConfig, nameUsedMetric);
                            console.log("loadedConfig", loadedConfig);
                            chart(loadedConfig);
                        }
                    })
            };

            reader.readAsText(file);
        });
});

function updateSelects(fileJson)
{
    //Update select criterion
    const selectCriterion = document.getElementById("selectCriterion");
    let optionsHTMLCriterion = ["<option value='' selected disabled hidden>Choose Criterion</option>", ...fileJson.perCriterion.map(obj => `<option value='${obj.criterion}'> ${obj.criterion}</option>`)];
    selectCriterion.innerHTML = optionsHTMLCriterion.join("");

    //Update select config
    const selectConfig = document.getElementById("selectConfig");
    let optionsHTMLConfig = ["<option value='' selected disabled hidden>Choose config</option>", ...fileJson.perCombination.map(combConf => `<option value='${combConf.combination}'> ${combConf.combination}</option>`)];
    selectConfig.innerHTML = optionsHTMLConfig.join("");

    //Update select metrics
    const selectMetric = document.getElementById("selectMetric");
    let optionsHTMLMetric = fileJson.metricsNames.map((name, index) => `<option${index === 0 ? " selected" : ""} value='${name}'> ${name}</option>`);
    selectMetric.innerHTML = optionsHTMLMetric.join("");
}

function updateConfig(loadedConfig, nameUsedMetric)
{
    //Update tooltip callback
    if(loadedConfig.options.tooltips !== undefined && loadedConfig.options.tooltips.callbacks !== undefined && loadedConfig.options.tooltips.callbacks.label !== undefined)
    {
        const label = loadedConfig.options.tooltips.callbacks.label;
        if(typeof label !== "function")
        {
            loadedConfig.options.tooltips.callbacks.label = callback;
        }
    }

    //Update y and error bars in dataset
    loadedConfig.data.datasets.forEach(dataset =>
    {
        //Update data attribute
        dataset.data.forEach(oneData =>
        {
            let nameGoodMetric = Object.keys(oneData)
                .map(key => key.split("_"))
                .filter(arr => arr[arr.length - 1] === nameUsedMetric)[0].join("_");
            oneData.y = oneData[nameGoodMetric];
        });

        //Update error bars
        if(dataset.allErrorBars !== undefined)
        {
            let nameGoodMetric = Object.keys(dataset.allErrorBars)
                .map(key => key.split("_"))
                .filter(arr => arr[arr.length - 1] === nameUsedMetric)[0].join("_");
            dataset.errorBars = dataset.allErrorBars[nameGoodMetric];
        }

    });

    return loadedConfig;
}

function callback(tooltipItem, data)
{
    let dataObj = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
    return Object.keys(dataObj).filter(key => key !== "x" && key !== "y"  && key !== "criterionValue").map(key => `${key}: ${dataObj[key]}`);
}

function chart(loadedConfig)
{
    let ctx = document.getElementById('myChart').getContext('2d');
    if(myChart !== undefined)
    {
        myChart.destroy();
    }
    myChart = new Chart(ctx, loadedConfig);
}